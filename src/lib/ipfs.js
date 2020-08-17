/*
  Business-logic library for interacting with the IPFS network.
*/

// Global npm libraries.
const IPFS_LIB = require('ipfs')
const fs = require('fs')

// Local libraries.
const config = require('../../config')
const wlogger = require('./wlogger')

let _this

class IPFS {
  constructor () {
    this.fs = fs
    this.ipfs = false

    _this = this
  }

  async startIPFS (repository, configuration) {
    // eslint-disable-next-line no-useless-catch
    try {
      if (repository && typeof repository !== 'string') {
        throw new Error("'ipfs repository' must be a String!")
      }

      if (configuration && typeof configuration !== 'object') {
        throw new Error("'ipfs configuration' must be a Object!")
      }
      // for validate if it exits file  or directory
      if (repository && _this.fs.existsSync(repository)) {
        throw new Error("'ipfs repository' are already exists!")
      }

      // starting ipfs node
      console.log('Starting IPFS...!')
      this.ipfs = await IPFS_LIB.create(config.ipfsOptions)

      console.log('... IPFS is ready.')

      return this.ipfs
    } catch (err) {
      wlogger.error('Error in lib/ipfs.js/startIPFS()')
      throw err
    }
  }

  async getNode () {
    return this.ipfs
  }
}

module.exports = IPFS
