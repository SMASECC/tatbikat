PYTHON ?= python3
ANSIBLE_PLAYBOOK ?= $(if $(wildcard .venv/bin/ansible-playbook),$(abspath .venv/bin/ansible-playbook),ansible-playbook)

.PHONY: check plan scenario-plan frontend backend-check infra-syntax preflight
check:
	$(PYTHON) scripts/check.py
plan:
	$(PYTHON) scripts/validate_repo.py
	$(PYTHON) scripts/render_infra.py
scenario-plan:
	$(PYTHON) scripts/scenario_plan.py
frontend:
	$(PYTHON) frontend/build.py
backend-check:
	cd backend/starter-v0.1 && $(PYTHON) -m unittest discover -s tests -v
infra-syntax: plan
	$(PYTHON) scripts/check_ansible.py --ansible-playbook "$(ANSIBLE_PLAYBOOK)"
preflight:
	bash install.sh --preflight-only
