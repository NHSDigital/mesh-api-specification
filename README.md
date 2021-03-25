# mesh-api-api

![Build](https://github.com/NHSDigital/mesh-api-api/workflows/Build/badge.svg?branch=master)

This is a RESTful HL7® FHIR® API specification for the *Message Exchange for Social Care and Health (MESH) API*.

* `specification/` This [Open API Specification](https://swagger.io/docs/specification/about/) describes the endpoints, methods and messages exchanged by the API. Use it to generate interactive documentation; the contract between the API and its consumers.
* `scripts/` Utilities helpful to developers of this specification.
* `apiproxy/` The Apigee API Proxy

Consumers of the API will find developer documentation on the [NHS Digital Developer Hub](https://digital.nhs.uk/developer/api-catalogue/message-exchange-for-social-care-and-health-api).  A description of the MESH service can be found at the [NHS Digital Services](https://digital.nhs.uk/services/message-exchange-for-social-care-and-health-mesh)

## Contributing
Contributions to this project are welcome from anyone, providing that they conform to the [guidelines for contribution](https://github.com/NHSDigital/mesh-api-api/blob/master/CONTRIBUTING.md) and the [community code of conduct](https://github.com/NHSDigital/mesh-api-api/blob/master/CODE_OF_CONDUCT.md).

### Licensing
This code is dual licensed under the MIT license and the OGL (Open Government License). Any new work added to this repository must conform to the conditions of these licenses. In particular this means that this project may not depend on GPL-licensed or AGPL-licensed libraries, as these would violate the terms of those libraries' licenses.

The contents of this repository are protected by Crown Copyright (C).

## Development

### Requirements
* make
* nodejs + npm/yarn
* [poetry](https://github.com/python-poetry/poetry)

### Install
```
$ make install
```

#### Updating hooks
Some pre-commit hooks are installed as part of the install command above to ensure you can't commit invalid spec changes by accident. These are also run
in CI.

```
$ make install-hooks
```

### Environment Variables
Various scripts and commands rely on environment variables being set. These are documented with the commands.

:bulb: Consider using [direnv](https://direnv.net/) to manage your environment variables during development and maintaining your own `.envrc` file - the values of these variables will be specific to you and/or sensitive.

### Make commands
There are `make` commands that alias some of this functionality:
 * `lint` -- Lints the spec and code
 * `publish` -- Outputs the specification as a **single file** into the `dist/` directory
 * `serve` -- Serves a preview of the specification in human-readable format
 * `generate-examples` -- generate example objects from the specification


### VS Code Plugins

 * [openapi-lint](https://marketplace.visualstudio.com/items?itemName=mermade.openapi-lint) resolves links and validates entire spec with the 'OpenAPI Resolve and Validate' command
 * [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) provides sidebar navigation


### Emacs Plugins

 * [**openapi-yaml-mode**](https://github.com/esc-emacs/openapi-yaml-mode) provides syntax highlighting, completion, and path help

### Speccy

> [Speccy](http://speccy.io/) *A handy toolkit for OpenAPI, with a linter to enforce quality rules, documentation rendering, and resolution.*

Speccy does the lifting for the following npm scripts:

 * `test` -- Lints the definition
 * `publish` -- Outputs the specification as a **single file** into the `dist/` directory
 * `serve` -- Serves a preview of the specification in human-readable format

(Workflow detailed in a [post](https://developerjack.com/blog/2018/maintaining-large-design-first-api-specs/) on the *developerjack* blog.)

:bulb: The `publish` command is useful when uploading to Apigee which requires the spec as a single file.

### Caveats

#### Swagger UI
Swagger UI unfortunately doesn't correctly render `$ref`s in examples, so use `speccy serve` instead.

#### Apigee Portal
The Apigee portal will not automatically pull examples from schemas, you must specify them manually.

## Deployment

#### Environment variables

You need a apgiee account to deploy to apigee
* `APIGEE_USERNAME` - your apigee username
* `APIGEE_PASSWORD` - your apigee password

Navigate to develop/specs in the apigee ui and select the spec you want to update, the APIGEE_SPEC_ID is the last id in the url
.../specs/folder/.../editor/{APIGEE_SPEC_ID}
* `APIGEE_SPEC_ID`

Navigate to publish/portals
In chrome open the developer tools to monitor network traffic
For the portal that your spec belongs to click on "manage spec snapshot"
Then click "update snapshot" the APIGEE_PORTAL_API_ID will be the number in the network tab.
* `APIGEE_PORTAL_API_ID`

This is the value in the top left corner of the apigee web-console
* `APIGEE_ORGANIZATION`

Comma-separated list of environments to deploy to (e.g. `test,prod`)
* `APIGEE_ENVIRONMENTS`

Name of the API Proxy for deployment
* `APIGEE_APIPROXY`

The proxy's base path (must be unique)
* `APIGEE_BASE_PATH`

Name of the environment you are running tests against
* `ENVIRONMENT`

The base url of the proxy when deployed to apigee
* `API_TEST_URL`

### Github Deployment

Github uses Github actions to deploy the code to apigee. The Github action uses secrets to populate environment variables.
You need a Github secret for each environment variable. Each of the above environment variables need an equivalent secret in Github for
the deployment to work. These are pre-populated for you [here](https://github.com/NHSDigital/mesh-api-api/settings/secrets/new). 
If you get a 404 for this page you will need to update your Github account permissions.

### Local Deployment

#### Specification
Update the API Specification and derived documentation in the Portal.

This will only allow you to update an existing spec, so you have to create the spec first using the apigee web console.

`make deploy-spec` with environment variables:

* `APIGEE_USERNAME`
* `APIGEE_PASSWORD`
* `APIGEE_SPEC_ID`
* `APIGEE_PORTAL_API_ID`

#### API Proxy & Sandbox Service
Redeploy the API Proxy and hosted Sandbox service.

If you use the same APIGEE_APIPROXY it will just create a new revision of the api proxy.

If you use the same APIGEE_BASE_PATH as an existing api proxy it will cause problems.

`make deploy-proxy` with environment variables:

* `APIGEE_USERNAME`
* `APIGEE_PASSWORD`
* `APIGEE_ORGANIZATION`
* `APIGEE_ENVIRONMENTS`
* `APIGEE_APIPROXY`
* `APIGEE_BASE_PATH`

:bulb: Specify your own API Proxy (with base path) for use during development.
