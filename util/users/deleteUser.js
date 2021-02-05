/*
  This script is used to delete a user from the database.
*/

const mongoose = require('mongoose')

// Force test environment
// make sure environment variable is set before this file gets called.
// see test script in package.json.
// process.env.TOR_ENV = 'test'
const config = require('../../config')

const User = require('../../src/models/users')

const EMAIL = 'test@test.com'

async function deleteUser () {
  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(
    config.database,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )

  const user = await User.findOne({ email: EMAIL })

  await user.remove()

  mongoose.connection.close()
}
deleteUser()
