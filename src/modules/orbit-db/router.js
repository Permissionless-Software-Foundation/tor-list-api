/*
  Route handler library for the orbitdb endpoints.
*/

const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

module.exports.baseUrl = '/orbitdb'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [controller.writeToDb]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [controller.getDbEntries]
  },
  {
    method: 'GET',
    route: '/c/:category',
    handlers: [controller.getDbEntriesByCategory]
  }

]
