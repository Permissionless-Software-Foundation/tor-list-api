const Blacklist = require('../../models/blacklist')

let _this
class UserController {
  constructor () {
    _this = this
    this.Blacklist = Blacklist
  }

  /**
   * @api {post} /blacklist Creates new entry for a site in the blacklist
   * @apiName addToBlacklist
   * @apiGroup Blacklist
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X POST -d '{ "hash": "e09f6a7593f8ae3994ea57e1117f67ec", "reason": "It is being spammed" }' localhost:5001/blacklist
   *
   * @apiParam {String} hash    Hash for orbitdb.
   * @apiParam {String} reason  Reason to ban the site.
   *
   * @apiSuccess {Object}   entry           Entry object
   * @apiSuccess {ObjectId} entry._id       Entry id
   * @apiSuccess {String}   entry.hash      Hash for orbitdb
   * @apiSuccess {String}   entry.reason    Reason to ban the site
   * @apiSuccess {String}   message         success message
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entry": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "hash": "e09f6a7593f8ae3994ea57e1117f67ec"
   *          "reason": "It's being spammed"
   *       },
   *        "message": "Site added to the blacklist"
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
  async addToBlacklist (ctx) {
    const entry = new _this.Blacklist(ctx.request.body)

    try {
      /*
       * ERROR HANDLERS
       */
      // Required property
      if (typeof entry.hash !== 'string' || !entry.hash.length) {
        throw new Error("Property 'hash' must be a string!")
      }
      if (typeof entry.reason !== 'string' || !entry.reason.length) {
        throw new Error("Property 'reason' must be a string!")
      }

      await entry.save()

      const response = entry.toJSON()

      ctx.body = {
        entry: response,
        message: 'Site added to the blacklist'
      }
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }

  /**
   * @api {get} /blacklist Get all entries in blacklist
   * @apiName getBlacklist
   * @apiGroup Blacklist
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/blacklist
   *
   * @apiSuccess {Object[]} blacklist       Array of entries object
   * @apiSuccess {ObjectId} entry._id       Entry id
   * @apiSuccess {String}   entry.hash      Hash for orbitdb
   * @apiSuccess {String}   entry.reason    Reason to ban the site
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "blacklist": [{
   *          "_id": "56bd1da600a526986cf65c80"
   *          "hash": "e09f6a7593f8ae3994ea57e1117f67ec"
   *          "reason": "It's being spammed"
   *       }]
   *     }
   *
   */
  async getBlacklist (ctx) {
    try {
      const blacklist = await _this.Blacklist.find()
      ctx.body = { blacklist }
    } catch (error) {
      ctx.throw(404)
    }
  }

  /**
   * @api {get} /blacklist/:id Get blacklist item either by id or hash
   * @apiName getBlacklistItem
   * @apiGroup Blacklist
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/blacklist/e09f6a7593f8ae3994ea57e1117f67ec
   *
   * @apiSuccess {Object}   entry           Entry object
   * @apiSuccess {ObjectId} entry._id       Entry id
   * @apiSuccess {String}   entry.hash      Hash for orbitdb
   * @apiSuccess {String}   entry.reason    Reason to ban the site
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entry": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "hash": "e09f6a7593f8ae3994ea57e1117f67ec"
   *          "reason": "It's being spammed"
   *       }
   *     }
   *
   */
  async getBlacklistItem (ctx, next) {
    try {
      let entry = await _this.Blacklist.findOne({ hash: ctx.params.id })
      if (!entry) {
        entry = await _this.Blacklist.findById(ctx.params.id)
      }

      ctx.body = {
        entry
      }
    } catch (err) {
      if (err === 404 || err.name === 'CastError') {
        ctx.throw(404)
      }

      ctx.throw(500)
    }
    if (next) {
      return next()
    }
  }

  /**
   * @api {put} /blacklist/:id Update a item in the blacklist
   * @apiName UpdateBlacklistItem
   * @apiGroup Blacklist
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X PUT -d '{ "reason": "It is not a real site" }' localhost:5001/blacklist/56bd1da600a526986cf65c80
   *
   * @apiParam {String} hash    Hash for orbitdb.
   * @apiParam {String} reason  Reason to ban the site.
   *
   * @apiSuccess {Object}   entry           Entry object
   * @apiSuccess {ObjectId} entry._id       Entry id
   * @apiSuccess {String}   entry.hash      Hash for orbitdb
   * @apiSuccess {String}   entry.reason    Reason to ban the site
   * @apiSuccess {String}   message         success message
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entry": {
   *          "_id": "56bd1da600a526986cf65c80"
   *          "hash": "e09f6a7593f8ae3994ea57e1117f67ec"
   *          "reason": "It is not a real site"
   *       },
   *       "message": "Entry successfully updated"
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
   *
   * @apiUse TokenError
   */
  async updateBlacklistItem (ctx) {
    // This variable is intended to validate the properties
    // sent by the client
    const newEntry = ctx.request.body

    const oldEntry = ctx.body.entry
    try {
      /*
       * ERROR HANDLERS
       *
       */
      // Required property
      if (newEntry.hash && typeof newEntry.hash !== 'string') {
        throw new Error("Property 'hash' must be a string!")
      }
      if (newEntry.reason && typeof newEntry.reason !== 'string') {
        throw new Error("Property 'reason' must be a string!")
      }

      Object.assign(oldEntry, newEntry)

      await oldEntry.save()

      ctx.body = {
        entry: oldEntry,
        message: 'Entry successfully updated'
      }
    } catch (error) {
      ctx.throw(422, error.message)
    }
  }

  /**
   * @api {delete} /blacklist/:id Delete a user
   * @apiName DeleteBlacklistItem
   * @apiGroup Blacklist
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X DELETE localhost:5000/blacklist/56bd1da600a526986cf65c80
   *
   * @apiSuccess {StatusCode} 200
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true
   *     }
   *
   * @apiUse TokenError
   */
  async deleteBlacklistItem (ctx) {
    const entry = ctx.body.entry
    await entry.remove()
    ctx.status = 200
    ctx.body = {
      success: true
    }
  }
}

module.exports = UserController
