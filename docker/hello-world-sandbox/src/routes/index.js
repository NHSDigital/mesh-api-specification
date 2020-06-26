const getStatus = require('./get-status')
const helloWorld = require('./hello-world')
const helloApplication = require('./hello-application')
const helloUser = require('./hello-user')

const routes = [].concat(getStatus, helloWorld, helloApplication, helloUser)

module.exports = routes