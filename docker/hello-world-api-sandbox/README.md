# Stub API Server

Stub API Server built using [apimocker](https://github.com/gstroup/apimocker) deployable as a [Apigee Hosted Target](https://docs.apigee.com/api-platform/hosted-targets/hosted-targets-overview).

Intended for "sandbox" functionality, and is the target endpoint for the hosted docs' *Try it now* functionality.

## Developing

```
docker build -t hello-world-api-sandbox -f docker/hello-world-api-sandbox/Dockerfile ./docker/hello-world-api-sandbox
docker run --name hello-world-api-sandbox -p 9000:9000 hello-world-api-sandbox:latest
```

 * Use the examples from the OAS (`components/examples/`) sym-linking them into the app.

## Deployment

Redeploy the API Proxy. See the main [README.md](../README.md).

## Endpoints

- [x] GET    `/hello/world`
- [x] GET    `/hello/application`
- [x] GET    `/hello/user`
