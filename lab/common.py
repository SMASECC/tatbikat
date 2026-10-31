import json
import os
from pathlib import Path
import ssl
import time
import urllib.request


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_private(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    temporary = path.with_name(path.name + ".new")
    descriptor = os.open(temporary, os.O_CREAT | os.O_TRUNC | os.O_WRONLY, 0o600)
    with os.fdopen(descriptor, "w") as output:
        json.dump(value, output, ensure_ascii=False, indent=2)
        output.write("\n")
    temporary.replace(path)


def request(url, body=None, token=None, ca=None, cert=None, key=None, timeout=5, session=None):
    context = ssl.create_default_context(cafile=ca)
    if cert:
        context.load_cert_chain(cert, key)
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    if session:
        headers['X-Kalkan-Session']=session
    data = json.dumps(body, allow_nan=False).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, context=context, timeout=timeout) as response:
        return json.load(response)


def append_log(path, event, **values):
    record = {"app": "kalkan_lab", "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
              "event_type": event, **values}
    with open(path, "a", encoding="utf-8") as output:
        output.write(json.dumps(record, ensure_ascii=False, allow_nan=False) + "\n")
