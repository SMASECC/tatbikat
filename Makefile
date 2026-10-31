PYTHON ?= python3
ANSIBLE_PLAYBOOK ?= $(if $(wildcard .venv/bin/ansible-playbook),$(abspath .venv/bin/ansible-playbook),ansible-playbook)

.PHONY: check plan frontend backend-check infra-syntax preflight base-os
check:
	$(PYTHON) scripts/check.py
plan:
	$(PYTHON) scripts/validate_repo.py
	$(PYTHON) scripts/render_infra.py
frontend:
	$(PYTHON) frontend/build.py
backend-check:
	cd backend/starter-v0.1 && $(PYTHON) -m unittest discover -s tests -v
infra-syntax: plan
	cd infra && $(ANSIBLE_PLAYBOOK) playbooks/preflight.yml --syntax-check
	cd infra && $(ANSIBLE_PLAYBOOK) playbooks/base-os.yml --syntax-check
preflight: plan
	cd infra && $(ANSIBLE_PLAYBOOK) playbooks/preflight.yml -e @../.local/site.yml
base-os: plan
	cd infra && $(ANSIBLE_PLAYBOOK) playbooks/base-os.yml -e @../.local/site.yml
