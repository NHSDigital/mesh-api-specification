SHELL=/bin/bash -euo pipefail

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm install

install-hooks:
	cp scripts/pre-commit .git/hooks/pre-commit

test:
	@echo disable for spec only

black:
	poetry run black .

black-check:
	poetry run black . --check

ruff: black
	poetry run ruff --fix --show-fixes .

ruff-check:
	poetry run ruff .

ruff-ci:
	poetry run ruff --output-format=github .

lint: ruff
	npm run lint

publish:
	npm run publish 2> /dev/null

serve: 
	npm run serve

clean:
	rm -rf build
	rm -rf dist

check-licenses:
	npm run check-licenses
	scripts/check_python_licenses.sh

format:
	poetry run black **/*.py

release: clean publish
	mkdir -p dist
	cp -r build/. dist
