const ORBIT_LIB = require('orbit-db')

// Local libraries.
const wlogger = require('./wlogger')
const config = require('../../config')

let _this

class ORBIT {
  constructor () {
    _this = this

    this.db = false
    this.orbit_lib = ORBIT_LIB
  }

  async startOrbit (ipfsNode) {
    // eslint-disable-next-line no-useless-catch
    try {
      // validate input
      if (typeof ipfsNode !== 'object') {
        throw new Error('The ipfs node must be an object')
      }

      // creating orbit instance
      console.log('Starting OrbitDB...!')
      const orbitdb = await _this.orbit_lib.createInstance(
        ipfsNode,
        config.orbitOptions
      )
      const options = {
        accessController: {
          write: [orbitdb.identity.id]
        }
      }

      // starting orbitDB eventlog
      this.db = await orbitdb.eventlog('tor-list', options)
      await this.db.load()

      console.log('... OrbitDB is ready.')
      console.log(`db id: ${this.db.id}`)

      return this.db
    } catch (err) {
      wlogger.error('Error in lib/orbitdb.js/startOrbit()')
      throw err
    }
  }

  async getNode () {
    return this.db
  }
}

const orbit = new ORBIT()
module.exports = orbit
