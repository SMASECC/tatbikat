"""Purpose-built CWE-78 service. Only the exercise profile enables the flaw."""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import re
import subprocess
import time
from urllib.parse import urlsplit
from .common import append_log, load

LAB_ID = "KALKAN-1"


def validate_filename(filename, profile, timeout=8):
    if not isinstance(filename, str) or len(filename) > 8192:
        raise ValueError("Geçersiz dosya adı")
    if profile != "exercise":
        if not re.fullmatch(r"[A-Za-z0-9_.-]{1,80}", filename):
            raise ValueError("Dosya adı reddedildi")
        command = ["/usr/bin/printf", "%s", filename]
        return subprocess.run(command, text=True, capture_output=True, timeout=timeout)
    # Intentional CWE-78 in the dedicated lab VM. This is the exercise entry point.
    return subprocess.run("printf '%s' " + filename, shell=True, executable="/bin/sh",
                          text=True, capture_output=True, timeout=timeout)


class PortalHandler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def reply(self, status, data):
        content = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)

    def do_GET(self):
        if urlsplit(self.path).path not in ("/healthz", "/feed"):
            return self.reply(404, {"error": "Bulunamadı"})
        profile = load(self.server.profile_path)
        return self.reply(200, {"lab_id": LAB_ID, "service": "kalkan-data-portal", "version": "1.0.0",
                                "profile": profile["profile"], "run_id": profile.get("run_id"), "server_time": time.time(),
                                "last_execution_at":getattr(self.server,'last_execution_at',None)})

    def do_POST(self):
        if urlsplit(self.path).path != "/api/v1/validate":
            return self.reply(404, {"error": "Bulunamadı"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if self.headers.get("Transfer-Encoding") or not 1 <= size <= 12288:
                return self.reply(413, {"error": "İstek boyutu geçersiz"})
            payload = json.loads(self.rfile.read(size))
            profile = load(self.server.profile_path)
            if profile.get("lab_id") != LAB_ID:
                return self.reply(503, {"error": "Lab işareti bulunamadı"})
            result = validate_filename(payload.get("filename"), profile["profile"])
            if profile['profile']=='exercise' and result.returncode==0 and ';' in payload['filename']:
                self.server.last_execution_at=time.time()
            source = self.headers.get("X-Real-IP", self.client_address[0]) if self.client_address[0] == "127.0.0.1" else self.client_address[0]
            append_log(self.server.log_path, "portal.validation", run_id=profile.get("run_id"),
                       srcip=source, uid=os.getuid(), euid=os.geteuid(), exit_code=result.returncode,
                       input_sha256=hashlib.sha256(payload["filename"].encode()).hexdigest())
            self.reply(200, {"stdout": result.stdout[:32768], "stderr": result.stderr[:4096], "returncode": result.returncode})
        except (ValueError, TypeError, AttributeError):
            self.reply(400, {"error": "İstek reddedildi"})
        except subprocess.TimeoutExpired:
            self.reply(504, {"error": "İşlem süre sınırına ulaştı"})


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", default="/etc/kalkan/profile.json")
    parser.add_argument("--log", default="/var/log/kalkan/portal.jsonl")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8089)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), PortalHandler)
    server.profile_path, server.log_path = args.profile, args.log
    server.serve_forever()


if __name__ == "__main__":
    main()
