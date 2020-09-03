const mongoose = require('mongoose')
// const config = require('../../config')

const Blacklist = new mongoose.Schema({
  hash: { type: String, default: '' },
  reason: { type: String, default: '' }
})

// export default mongoose.model('user', User)
module.exports = mongoose.model('blacklist', Blacklist)
