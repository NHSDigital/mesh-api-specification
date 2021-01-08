SHELL=/bin/bash -euo pipefail

install:
	 npm install

lint:
	npm run lint

build:
	docker build -t mesh-api .

run:
	docker run -p 9000:9000 mesh-api:latest
