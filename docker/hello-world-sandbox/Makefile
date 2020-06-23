SHELL=/bin/bash -euo pipefail

install:
	 npm install

lint:
	npm run lint

build:
	docker build -t hello-world-api-sandbox .

run:
	docker run -p 9000:9000 hello-world-api-sandbox:latest

kill:
	docker kill $$(docker ps --filter "ancestor=hello-world-api-sandbox" --format "{{.Names}}")
