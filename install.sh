#!/usr/bin/env bash
# Run from a trusted Git checkout on the Proxmox host, not with curl | bash.
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
exec python3 deploy/quickstart.py "$@"
