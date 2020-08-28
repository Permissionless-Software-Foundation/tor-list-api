/*
  Route handler library for the orbitdb endpoints.
*/

const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

module.exports.baseUrl = '/orbitdb'

module.exports.routes = [
  {
    method: 'POST',
    route: '/write',
    handlers: [controller.writeToDb]
  },
  {
    method: 'GET',
    route: '/entries',
    handlers: [controller.getDbEntries]
  }
]
