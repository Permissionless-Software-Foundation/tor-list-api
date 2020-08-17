/*
  This file contains the route handler for REST API calls associated with
  writing to the OrbitDB database.
*/

// const OrbitDB = require('orbit-db')

// let _this

class DbController {
  // constructor () {
  // _this = this
  // }

  async writeToDb (ctx) {
    try {
      console.log('Fill in this code.')
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = DbController
