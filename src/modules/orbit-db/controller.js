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
   * @apiName WriteToDb
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "entry": "examplepage.com" }' localhost:5001/orbitdb/write
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
      // Error handler
      if (!ctx.request.body.entry || typeof ctx.request.body.entry !== 'string') {
        throw new Error("Property 'entry' must be a string!")
      }

      const db = await _this.orbitDB.getNode()
      const entry = { userName: 'tor-list', message: ctx.request.body.entry }
      const hash = await db.add(entry)
      ctx.body = {
        hash
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }
}

module.exports = DbController
