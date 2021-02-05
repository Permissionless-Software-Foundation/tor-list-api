const mongoose = require('mongoose')

const config = require('../../config')

const Blacklist = require('../../src/models/blacklist')

async function getUsers () {
  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const blacklist = await Blacklist.find({})
  console.log(`blacklist: ${JSON.stringify(blacklist, null, 2)}`)

  mongoose.connection.close()
}
getUsers()
