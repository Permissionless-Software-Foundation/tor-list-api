const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// export const baseUrl = '/blacklist'
module.exports.baseUrl = '/blacklist'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [controller.addToBlacklist]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [controller.getBlacklist]
  },
  {
    method: 'GET',
    route: '/:id',
    handlers: [controller.getBlacklistItem]
  },
  {
    method: 'PUT',
    route: '/:id',
    handlers: [
      controller.getBlacklistItem,
      controller.updateBlacklistItem
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      controller.getBlacklistItem,
      controller.deleteBlacklistItem
    ]
  }
]
