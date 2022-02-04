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

lint:
	npm run lint
	poetry run flake8

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
