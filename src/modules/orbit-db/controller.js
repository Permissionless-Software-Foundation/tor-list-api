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
   * curl -H "Content-Type: application/json" -X POST -d '{ "entry": "example.com", "slpAddress": "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp", "description": "this is the sample page", "signature": "signature", "category": "bch" }' localhost:5001/orbitdb/write
   *
   * @apiParam {String} entry the new site url to be included (required)
   * @apiParam {String} slpAddress the slp address related to the site(required)
   * @apiParam {String} description a brief explanation of what's the site for (required)
   * @apiParam {String} signature the new site's signature (required)
   * @apiParam {String} category the new site's category (required)
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
    const body = ctx.request.body
    const acceptedCategories = ['bch', 'ecommerce', 'info', 'eth', 'ipfs']
    try {
      /*
       * ERROR HANDLERS
       *
       */
      // Required property
      if (typeof body.entry !== 'string' || !body.entry.length) {
        throw new Error("Property 'entry' must be a string!")
      }
      if (typeof body.description !== 'string' || !body.description.length) {
        throw new Error("Property 'description' must be a string!")
      }
      if (typeof body.slpAddress !== 'string' || !body.slpAddress.length) {
        throw new Error("Property 'slpAddress' must be a string!")
      }
      if (typeof body.signature !== 'string' || !body.signature.length) {
        throw new Error("Property 'signature' must be a string!")
      }
      if (typeof body.category !== 'string' || !body.category.length) {
        throw new Error("Property 'category' must be a string!")
      }
      const criteria = acceptedCategories.some(item => body.category.trim() === item)
      if (!criteria) {
        throw new Error("Property 'category' must be 'bch', 'ecommerce', 'info', 'eth', or 'ipfs'!")
      }

      // Add the entry to the database.
      const db = await _this.orbitDB.getNode()
      const entry = {
        entry: body.entry.trim(),
        slpAddress: body.slpAddress.trim(),
        description: body.description.trim(),
        signature: body.signature.trim(),
        category: body.category.trim()
      }
      const hash = await db.add(entry)
      ctx.body = {
        hash
      }
    } catch (err) {
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
