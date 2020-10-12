const validators = require('../../middleware/validators')
const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// export const baseUrl = '/blacklist'
module.exports.baseUrl = '/blacklist'

module.exports.routes = [
  {
    method: 'POST',
    route: '/',
    handlers: [
      validators.ensureAdmin,
      controller.addToBlacklist
    ]
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
      validators.ensureAdmin,
      controller.getBlacklistItem,
      controller.updateBlacklistItem
    ]
  },
  {
    method: 'DELETE',
    route: '/:id',
    handlers: [
      validators.ensureAdmin,
      controller.getBlacklistItem,
      controller.deleteBlacklistItem
    ]
  }
]
