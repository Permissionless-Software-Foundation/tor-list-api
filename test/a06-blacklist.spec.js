const testUtils = require('./utils')
const config = require('../config')
const assert = require('chai').assert

const axios = require('axios').default

const LOCALHOST = `http://localhost:${config.port}`

const context = {}

describe('Blacklist', () => {
  before(async () => {
    context.hash = 'e09f6a7593f8ae3994ea57e1117f67ec'
    context.reason = 'It is being spammed'

    const userObj = {
      email: 'test3@test.com',
      password: 'pass3'
    }
    const testUser = await testUtils.createUser(userObj)

    context.user3 = testUser.user
    context.token3 = testUser.token
    context.id3 = testUser.user._id

    // Get the JWT used to log in as the admin 'system' user
    const adminJWT = await testUtils.getAdminJWT()
    context.adminJWT = adminJWT
  })

  describe('POST /blacklist', () => {
    it('should not allow posting if token is invalid', async () => {
      const options = {
        method: 'POST',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer 1'
        }
      }

      try {
        await axios(options)
        assert.fail('Unexpected behavior')
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should throw 401 if user is not admin', async () => {
      const { token3 } = context

      const options = {
        method: 'POST',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token3}`
        },
        data: {
          reason: context.reason
        }
      }
      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 401, 'Error code 401 expected.')
      }
    })

    it('should throw 422 if data is incomplete', async () => {
      const { adminJWT } = context
      const options = {
        method: 'POST',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          reason: context.reason
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if reason is missing or is not a string', async () => {
      const { adminJWT } = context

      const options = {
        method: 'POST',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          hash: context.hash
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should add the entry to the blacklist and return it', async () => {
      const { adminJWT } = context

      const options = {
        method: 'POST',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: context
      }

      const result = await axios(options)
      assert(result.status === 200, 'Status Code 200 expected.')
      assert.property(result.data.entry, '_id', 'entry _id expected')
      assert.equal(result.data.entry.hash, context.hash)
    })
  })

  describe('GET /blacklist', () => {
    it('should fetch all the data in the blacklist collection', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/blacklist`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'blacklist', 'blacklist property expected')
      const blacklist = result.data.blacklist
      assert.isNumber(blacklist.length)
      assert.hasAnyKeys(blacklist[0], ['_id', 'hash', 'reason'])
    })
  })

  describe('GET /blacklist/:id', () => {
    it('should throw 404 if no entry contains the given hash or _id', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/blacklist/hellothere`,
        headers: {
          Accept: 'application/json'
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 404, 'Error code 404 expected.')
      }
    })

    it('should fetch an entry data in the blacklist collection', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entry', 'entry property expected')
      assert.hasAnyKeys(result.data.entry, ['_id', 'hash', 'reason'])
      assert.equal(result.data.entry.hash, context.hash)
    })
  })

  describe('PUT /blacklist/:id', () => {
    it('should throw 404 if no entry contains the given hash or _id', async () => {
      const { adminJWT } = context
      const options = {
        method: 'PUT',
        url: `${LOCALHOST}/blacklist/hellothere`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          reason: "Time' up"
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 404, 'Error code 404 expected.')
      }
    })

    it('should throw 422 if hash is sent but isnt a string', async () => {
      const { adminJWT } = context
      const options = {
        method: 'PUT',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          hash: 123456
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if reason is sent but isnt a string', async () => {
      const { adminJWT } = context
      const options = {
        method: 'PUT',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          reason: 123456
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should update the entry and return it', async () => {
      const { adminJWT } = context
      const options = {
        method: 'PUT',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        },
        data: {
          reason: 'ITS BEEN UPDATED'
        }
      }

      try {
        const result = await axios(options)
        assert.property(result.data, 'entry', 'entry property expected')
        assert.property(result.data, 'message', 'message property expected')
        assert.hasAnyKeys(result.data.entry, ['_id', 'hash', 'reason'])
        assert.equal(result.data.entry.hash, context.hash)
        assert(
          result.data.entry.reason !== context.reason,
          'reason expected to be updated'
        )
      } catch (err) {
        assert(false, 'Unexpected result')
      }
    })
  })

  describe('DELETE /blacklist', () => {
    it('should not allow deleting if token is not valid', async () => {
      const options = {
        method: 'DELETE',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer 1'
        }
      }

      try {
        await axios(options)
        assert(false, 'Unexpected result')
      } catch (e) {
        assert(e.response.status === 401, 'Error code 401 expected.')
      }
    })

    it('delete the entry with the given hash or id', async () => {
      const { adminJWT } = context
      const options = {
        method: 'DELETE',
        url: `${LOCALHOST}/blacklist/${context.hash}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminJWT}`
        }
      }

      try {
        const result = await axios(options)
        assert.property(result.data, 'success', 'success property expected')
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
        assert(false, 'Unexpected result')
      }
    })
  })
})
