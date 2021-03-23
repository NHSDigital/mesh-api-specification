SHELL=/bin/bash -euo pipefail

install: install-node install-python install-hooks

install-python:
	poetry install

install-node:
	npm install
	cd docker/mesh-api && npm install && cd ../../tests && npm install

install-hooks:
	cp scripts/pre-commit .git/hooks/pre-commit

test:
	npm run test

lint:
	npm run lint
	cd docker/mesh-api && npm run lint && cd ..
	poetry run flake8

publish:
	npm run publish 2> /dev/null

serve: update-examples
	npm run serve

clean:
	rm -rf build
	rm -rf dist

generate-examples: publish
	mkdir -p build/examples
	poetry run python scripts/generate_examples.py build/mesh-api.json build/examples

update-examples: generate-examples
	jq -rM . <build/examples/resources/Greeting.json >specification/components/examples/Greeting.json
	make publish

check-licenses:
	npm run check-licenses
	scripts/check_python_licenses.sh

deploy-proxy: update-examples
	scripts/deploy_proxy.sh

deploy-spec: update-examples
	scripts/deploy_spec.sh

format:
	poetry run black **/*.py


build-proxy:
	scripts/build_proxy.sh

release: clean publish build-proxy
	mkdir -p dist
	tar -zcvf dist/package.tar.gz build
	for env in internal-dev int; do \
			cp ecs-proxies-deploy.yml dist/ecs-deploy-$$env.yml; \
	done

	cp -r build/. dist
	cp -r tests dist

# release: clean publish build-proxy
# 	mkdir -p dist
# 	tar -zcvf dist/package.tar.gz build
# 	cp -r terraform dist
# 	cp -r build/. dist
# 	cp -r tests dist

sandbox: update-examples
	cd docker/mesh-api && npm run start

