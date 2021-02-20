const assert = require('chai').assert

const BCHJS = require('../../src/lib/bch')

const sinon = require('sinon')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

let sandbox
let uut
describe('bch', () => {
  beforeEach(() => {
    uut = new BCHJS()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#_verifySignature', () => {
    it('should return true for valid signature', () => {
      const slpAddress = 'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd'
      const signature =
        'H1Bv2xUBGZBTuNsUghix03Yp8n8YPPkfsPq6LktwDpC2e1estOfYx96NH3/eaHJpQpPSHSb6pQYaiR3KZ6Z9lRc='
      const entry = 'example.com'
      const verifyObj = { slpAddress, signature, entry }

      const result = uut._verifySignature(verifyObj)

      assert.equal(result, true)
    })

    it('should return false for invalid signature', () => {
      const slpAddress = 'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd'
      const signature =
        'ICcj+ShSRIllp0iTqQK49Ltnycg1upaT7dK5CPAwNIBqEtegn305dPBf5IMdx/ScuyOBWPEfOqab2V73TbuK6Us='
      const entry = 'example.com'

      const verifyObj = { slpAddress, signature, entry }

      const result = uut._verifySignature(verifyObj)

      assert.equal(result, false)
    })

    it('should catch and throw errors', () => {
      try {
        // Force an error
        sandbox
          .stub(uut.bchjs.BitcoinCash, 'verifyMessage')
          .throws(new Error('test error'))

        const slpAddress = 'simpleledger:qp49th03gvjn58d6fxzaga6u09w4z56smyuk43lzkd'
        const signature =
          'ICcj+ShSRIllp0iTqQK49Ltnycg1upaT7dK5CPAwNIBqEtegn305dPBf5IMdx/ScuyOBWPEfOqab2V73TbuK6Us='
        const entry = 'example.com'
        const verifyObj = { slpAddress, signature, entry }
        uut._verifySignature(verifyObj)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
