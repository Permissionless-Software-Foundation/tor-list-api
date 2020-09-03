/*
  This file contains the route handler for REST API calls associated with
  writing to the OrbitDB database.
*/

const orbitDB = require('../../lib/orbitdb')

let _this

class DbController {
  constructor () {
    _this = this
    this.orbitDB = orbitDB
  }

  /**
   * @api {post} /orbit/write Create a new entry in the orbit database
   * @apiPermission public
   * @apiName WriteToDb
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "entry": "examplepage.com" }' https://tor-list-api.fullstack.cash/orbitdb/write
   *
   * @apiParam {String} entry the new entry to be included (required)
   *
   * @apiSuccess {string} hash The multihash of the entry as a String
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "hash": "zdpuB26zeD3Jg65X4DTgAZSkJjKS4pYkGaK3ibGqE6NP7z23d"
   *     }
   *
   * @apiError UnprocessableEntity Missing required parameters
   *
   * @apiErrorExample {json} Error-Response:
   *     HTTP/1.1 422 Unprocessable Entity
   *     {
   *       "status": 422,
   *       "error": "Unprocessable Entity"
   *     }
   */
  async writeToDb (ctx) {
    try {
      // Input Validation.
      if (
        !ctx.request.body.entry ||
        typeof ctx.request.body.entry !== 'string'
      ) {
        throw new Error("Property 'entry' must be a string!")
      }

      // Add the entry to the database.
      const db = await _this.orbitDB.getNode()
      const entry = { userName: 'tor-list', message: ctx.request.body.entry }
      const hash = await db.add(entry)
      ctx.body = {
        hash
      }
    } catch (err) {
      console.log('err: ', err)
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /orbit/entries Get all the data in the OrbitDB
   * @apiPermission public
   * @apiName getDbEntries
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET https://tor-list-api.fullstack.cash/orbitdb/entries
   * curl -H "Content-Type: application/json" -X GET http://localhost:5003/orbitdb/entries
   *
   * @apiSuccess {Object[]} entries         Array of orbitdb data
   * @apiSuccess {string}   users.userName  tor-list user
   * @apiSuccess {String}   user.message    entry message
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entries": [{
   *          "userName": "tor-list"
   *          "message": "some stored information"
   *       }]
   *     }
   *
   */
  async getDbEntries (ctx) {
    try {
      // Get a handle on the OrbitDB node.
      const db = await _this.orbitDB.getNode()

      // used for debugging.
      // const temp = db.iterator({ limit: -1 }).collect()
      // console.log(`temp: ${JSON.stringify(temp, null, 2)}`)

      // Get the entries of the DB.
      const entries = db
        .iterator({ limit: -1 })
        .collect()
        .map(entry => entry.payload.value)

      // Return the entries.
      ctx.body = { entries }
    } catch (error) {
      ctx.throw(404)
    }
  }
}

module.exports = DbController
