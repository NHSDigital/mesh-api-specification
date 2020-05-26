provider "apigee" {
  org          = var.apigee_organization
  access_token = var.apigee_token
}

terraform {
  backend "azurerm" {}

  required_providers {
    apigee = "~> 0.0"
    archive = "~> 1.3"
  }
}

module "hello-world" {
  source             = "github.com/NHSDigital/api-platform-service-module.git?ref=AMB-52-monitoring-and-alerting-with-statuscake"
  name               = "hello-world"
  path               = "hello-world"
  apigee_environment = var.apigee_environment
  proxy_type         = "sandbox"
  namespace          = var.namespace
  make_api_product   = length(var.namespace) == 0
  api_product_display_name = "Hello World Api"
  status_cake_username = var.status_cake_username
  status_cake_api_key = var.status_cake_api_key
  status_cake_status_apikey = var.status_cake_status_apikey
  status_cake_contact_group = var.status_cake_contact_group
}
