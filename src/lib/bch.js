/*
  This library contains methods for working with the BCHN and BCHA blockchains.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')

class Bch {
  constructor () {
    // Encapsulate dependencies
    this.bchjs = new BCHJS()
  }

  // Verify that the signature was signed by a specific BCH address.
  _verifySignature (verifyObj) {
    try {
      // Expand the input object.
      const { slpAddress, signature, entry } = verifyObj

      // Convert to BCH address.
      const scrubbedAddr = this.bchjs.SLP.Address.toCashAddress(slpAddress)

      const isValid = this.bchjs.BitcoinCash.verifyMessage(
        scrubbedAddr,
        signature,
        entry
      )

      return isValid
    } catch (err) {
      console.error('Error in bch.js/_verifySignature()')
      throw err
    }
  }
}

module.exports = Bch
