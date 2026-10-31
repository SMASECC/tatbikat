"""Shared CLI client; credentials stay in role-specific environment or a file."""
import json
import os
from pathlib import Path
import ssl
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, build_opener, HTTPSHandler, HTTPRedirectHandler, ProxyHandler


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs): return None


def request(role, path, body=None, session=None):
    base=os.environ.get("KALKAN_URL","http://127.0.0.1:8088").rstrip("/")
    address=urlsplit(base)
    if address.scheme not in ("http","https") or not address.netloc or address.username or address.query or address.fragment or address.path not in ("","/"):
        raise RuntimeError("KALKAN_URL yalnız http(s) kök adresi olmalı")
    token=os.environ.get("KALKAN_"+role.upper()+"_TOKEN")
    if not token:
        source=Path(os.environ.get("KALKAN_CREDENTIALS",str(Path(__file__).resolve().parents[1]/"runtime/credentials.json")))
        token=json.loads(source.read_text())[role]
    headers={"Authorization":"Bearer "+token,"Content-Type":"application/json"}
    if session: headers["X-Kalkan-Session"]=session
    raw=json.dumps(body,allow_nan=False).encode() if body is not None else None
    context=ssl.create_default_context(cafile=os.environ.get("KALKAN_CA_FILE"))
    opener=build_opener(ProxyHandler({}),NoRedirect(),HTTPSHandler(context=context))
    try:
        with opener.open(Request(base+path,raw,headers,method="POST" if raw is not None else "GET"),timeout=8) as response:
            return json.load(response)
    except HTTPError as exc:
        try: message=json.load(exc).get("error",str(exc.code))
        except ValueError: message=str(exc.code)
        raise RuntimeError(f"HTTP {exc.code}: {message}") from None
    except URLError as exc: raise RuntimeError(f"Bağlantı kurulamadı: {exc.reason}") from None
