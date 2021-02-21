const config = require('../../config')
const assert = require('chai').assert
const testUtils = require('./utils')

const axios = require('axios').default

const LOCALHOST = `http://localhost:${config.port}`

const UUT = require('../../src/modules/orbit-db/controller')
const context = {}

const addToBlackList = async (hash) => {
  try {
    const adminJWT = await testUtils.getAdminJWT()

    const options = {
      method: 'POST',
      url: `${LOCALHOST}/blacklist`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${adminJWT}`
      },
      data: {
        hash,
        reason: 'It is being spammed'
      }
    }

    await axios(options)
  } catch (error) {
    console.log(error)
  }
}

describe('Orbit', () => {
  let uut

  beforeEach(async () => {
    uut = new UUT()
  })

  describe('POST /orbitdb', () => {
    it('should throw 422 if data is incomplete', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 1234
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if slpAddress is missing or is not a string', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'sample.com ',
            slpAddress: '',
            description: 'this short description',
            signature: 'sample.com ',
            category: 'eth'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if description is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 1234,
            signature: 'sample.com ',
            category: 'eth'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if signature is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: true,
            category: 'bch'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if a caregoty is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: 'sample.com '
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if a caregoty is not in the accepted categories', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: 'sample.com ',
            category: 'sampleMUSTgiveERROR'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })
    it('should throw 406 if the signature , slpAddress or entry does not match', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'example.com',
            slpAddress:
              'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd',
            description: 'this is a sample page',
            signature: 'ICcj+ShSRIllp0iTqQK49Ltnycg1upaT7dK5CPAwNIBqEtegn305dPBf5IMdx/ScuyOBWPEfOqab2V73TbuK6Us=',
            category: 'bch'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 406, 'Error code 406 expected.')
      }
    })

    it('should add the entry to the database and return the hash', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'example.com',
            slpAddress:
              'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd',
            description: 'this is a sample page',
            signature: 'H1Bv2xUBGZBTuNsUghix03Yp8n8YPPkfsPq6LktwDpC2e1estOfYx96NH3/eaHJpQpPSHSb6pQYaiR3KZ6Z9lRc=',
            category: 'bch'
          }
        }

        const result = await axios(options)
        assert(result.status === 200, 'Status Code 200 expected.')
        assert.property(result.data, 'hash', 'hash of entry expected')
      } catch (err) {
        console.log('Error adding entry to the database: ' + err.message)
        throw err
      }
    })

    it('should add the entry to the database', async () => {
      /**
       *  This entry will help to test the following
       *  tests so it will be added to the blacklist
       *
       * */
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb`,
          data: {
            entry: 'example.com',
            slpAddress:
              'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd',
            description: 'this is a sample page',
            signature: 'H1Bv2xUBGZBTuNsUghix03Yp8n8YPPkfsPq6LktwDpC2e1estOfYx96NH3/eaHJpQpPSHSb6pQYaiR3KZ6Z9lRc=',
            category: 'bch'
          }
        }

        const result = await axios(options)
        assert(result.status === 200, 'Status Code 200 expected.')
        assert.property(result.data, 'hash', 'hash of entry expected')
        context.entryId = result.data.hash
      } catch (err) {
        console.log('Error adding entry to the database: ' + err.message)
        throw err
      }
    })
  })

  describe('GET /orbitdb', () => {
    it('should fetch all the data in the OrbitDB', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries

      context.entries = entries

      assert.property(entries[0], '_id')
      assert.property(entries[0], 'entry')
      assert.property(entries[0], 'category')
      assert.property(entries[0], 'signature')
      assert.property(entries[0], 'slpAddress')
      assert.property(entries[0], 'description')

      assert.isNumber(entries.length)
    })

    it('Should return the entries ignoring the blacklisted ones', async () => {
      await addToBlackList(context.entryId)

      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')

      const entries = result.data.entries
      const entry = entries[entries.length - 1]
      assert.notEqual(entry._id, context.entryId)
      assert.isNumber(entries.length)
      assert.notEqual(entries.length, context.entries.length)
    })
  })

  describe('GET /orbitdb/c/:category', () => {
    it('should fetch all the data in the OrbitDB with the given category', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/bch`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries

      assert.property(entries[0], '_id')
      assert.property(entries[0], 'entry')
      assert.property(entries[0], 'signature')
      assert.property(entries[0], 'slpAddress')
      assert.property(entries[0], 'description')
      assert.property(entries[0], 'category')
      assert.isNumber(entries.length)

      const hasOtherCategories = entries.some(item => item.category !== 'bch')
      assert.equal(hasOtherCategories, false, 'Contains differents categories')
    })

    it('should return an empty array', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/mango`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries
      assert(!entries.length, 'Expected empty array')
    })

    it('Should return the entries ignoring the blacklisted ones', async () => {
      await addToBlackList(context.entryId)

      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/bch`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')

      const entries = result.data.entries
      const entry = entries[entries.length - 1]

      assert.notEqual(entry._id, context.entryId)
      assert.isNumber(entries.length)
      assert.notEqual(entries.length, context.entries.length)
    })
  })

  describe('filterEntries()', () => {
    it('should throw error if input is not provided', async () => {
      try {
        await uut.filterEntries()
        assert(false, 'Unexpected result')
      } catch (error) {
        assert.include(
          error.message,
          'Input must be an array of entries'
        )
      }
    })

    it('should throw error if input is not an array of entries', async () => {
      try {
        await uut.filterEntries(1)
        assert(false, 'Unexpected result')
      } catch (error) {
        assert.include(
          error.message,
          'Input must be an array of entries'
        )
      }
    })

    it('should return empty array if array provided is empty', async () => {
      try {
        const result = await uut.filterEntries([])
        assert.isArray(result)
        assert.equal(result.length, 0)
      } catch (error) {
        assert(false, 'Unexpected result')
      }
    })

    it('Should return the entries ignoring the blacklisted ones', async () => {
      try {
        await addToBlackList(context.entryId)
        const result = await uut.filterEntries(context.entries)
        assert.isArray(result)
        assert.notEqual(result.length, context.entries.length)
      } catch (error) {
        assert(false, 'Unexpected result')
      }
    })

    it('Should return the same array if the entries does not match into the black list', async () => {
      try {
        // Mock
        const entries = [
          { _id: 'id1' },
          { _id: 'id2' },
          { _id: 'id3' }
        ]
        const result = await uut.filterEntries(entries)
        assert.isArray(result)
        assert.equal(result.length, entries.length)
        assert.equal(result[0]._id, entries[0]._id)
        assert.equal(result[1]._id, entries[1]._id)
        assert.equal(result[2]._id, entries[2]._id)
      } catch (error) {
        assert(false, 'Unexpected result')
      }
    })
  })
})
