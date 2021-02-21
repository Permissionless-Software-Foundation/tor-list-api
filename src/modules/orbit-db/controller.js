/*
  This file contains the route handler for REST API calls associated with
  writing to the OrbitDB database.
*/

const Blacklist = require('../../models/blacklist')
const orbitDB = require('../../lib/orbitdb')
const crypto = require('crypto')
const BCHJS = require('../../lib/bch')
let _this

class DbController {
  constructor () {
    _this = this
    this.Blacklist = Blacklist
    this.orbitDB = orbitDB
    this.crypto = crypto
    this.bchjs = new BCHJS()
  }

  /**
   * @api {post} /orbitdb Create a new entry in the orbit database
   * @apiPermission public
   * @apiName WriteToDb
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "entry": "example.com", "slpAddress": "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp", "description": "this is the sample page", "signature": "signature", "category": "bch" }' localhost:5001/orbitdb
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

      // Verify that the entry was signed by a specific BCH address.
      try {
        const isValidSignature = _this.bchjs._verifySignature(body)
        if (!isValidSignature) {
          throw new Error('Invalid signature')
        }
      } catch (err) {
        ctx.throw(406, err.message)
      }

      // Add the entry to the database.
      const db = await _this.orbitDB.getNode()
      const hash = _this.crypto.randomBytes(23).toString('hex')
      const entry = {
        _id: hash,
        entry: body.entry.trim(),
        slpAddress: body.slpAddress.trim(),
        description: body.description.trim(),
        signature: body.signature.trim(),
        category: body.category.trim()
      }
      await db.put(entry)
      ctx.body = { hash }
    } catch (err) {
      const status = err.status || 422
      ctx.throw(status, err.message)
    }
  }

  /**
   * @api {get} /orbitdb Get all the data in the OrbitDB
   * @apiPermission public
   * @apiName getDbEntries
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET https://tor-list-api.fullstack.cash/orbitdb
   * curl -H "Content-Type: application/json" -X GET http://localhost:5003/orbitdb
   *
   * @apiSuccess {Object[]} entries Array of orbitdb data
   * @apiSuccess {string} users._id entry unique id
   * @apiSuccess {String} entry.entry site url
   * @apiSuccess {String} entry.slpAddress the slp address related to the site
   * @apiSuccess {String} entry.description a brief explanation of what's the site for
   * @apiSuccess {String} entry.signature site's signature
   * @apiSuccess {String} entry.category site's category
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entries": [{
   *          "_id": "QmbYHhnXEdmdfUDzZKeEg7HyG2f8veaF2wBrYFcSHJ3mvd",
   *          "entry": "example.com",
   *          "category" : "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp",
   *          "signature" : "this is the sample page",
   *          "slpAddress" : "signature",
   *          "description" : "bch"
   *       }]
   *     }
   *
   */
  async getDbEntries (ctx) {
    try {
      // Get a handle on the OrbitDB node.
      const db = await _this.orbitDB.getNode()

      // used for debugging.
      // const temp = db.get('')
      // console.log(`temp: ${JSON.stringify(temp, null, 2)}`)

      // Get the entries of the DB.
      const entries = db
        .get('')

      const filteredEntries = await _this.filterEntries(entries)
      // Return the entries.
      ctx.body = { entries: filteredEntries }
    } catch (error) {
      ctx.throw(404)
    }
  }

  /**
   * @api {get} /orbitdb/c/:category Get all the data in the OrbitDB
   * @apiPermission public
   * @apiName getDbEntriesByCategory
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET https://tor-list-api.fullstack.cash/orbitdb/c/bch
   * curl -H "Content-Type: application/json" -X GET http://localhost:5003/orbitdb/c/bch
   *
   * @apiSuccess {Object[]} entries Array of orbitdb data
   * @apiSuccess {string} users._id entry unique id
   * @apiSuccess {String} entry.entry site url
   * @apiSuccess {String} entry.slpAddress the slp address related to the site
   * @apiSuccess {String} entry.description a brief explanation of what's the site for
   * @apiSuccess {String} entry.signature site's signature
   * @apiSuccess {String} entry.category site's category
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entries": [{
   *          "_id": "QmbYHhnXEdmdfUDzZKeEg7HyG2f8veaF2wBrYFcSHJ3mvd",
   *          "entry": "example.com",
   *          "category" : "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp",
   *          "signature" : "this is the sample page",
   *          "slpAddress" : "signature",
   *          "description" : "bch"
   *       }]
   *     }
   *
   */
  async getDbEntriesByCategory (ctx) {
    try {
      const db = await _this.orbitDB.getNode()

      // Get the entries of the DB.
      const entries = db
        .query(item => item.category === ctx.params.category)

      const filteredEntries = await _this.filterEntries(entries)
      // Return the entries.
      ctx.body = { entries: filteredEntries }
    } catch (error) {
      ctx.throw(404)
    }
  }

  // Filter the entries and return only the
  // non-blacklisted ones
  async filterEntries (entries) {
    try {
      // Validate Inputs
      if (!Array.isArray(entries)) {
        throw new Error('Input must be an array of entries')
      }
      if (!entries.length) {
        return entries
      }

      // Get Black List
      const blacklist = await _this.Blacklist.find()
      // console.log('blackList : ', blacklist)

      if (!blacklist.length) {
        return entries
      }

      const filteredEntries = []
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const _match = blacklist.filter((val) => val.hash === entry._id)

        if (!_match.length) {
          filteredEntries.push(entry)
        }
      }

      return filteredEntries
    } catch (error) {
      console.log('Error in src/modules/orbit-db/controller/filterEntries()')
      throw error
    }
  }
}

module.exports = DbController
