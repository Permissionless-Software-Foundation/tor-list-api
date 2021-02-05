/*
  These are the environment settings for the DEVELOPMENT environment.
  This is the environment run by default with `npm start` if TOR_ENV is not
  specified.
*/

module.exports = {
  session: 'secret-boilerplate-token',
  token: 'secret-jwt-token',
  database: 'mongodb://localhost:27017/tor-list-server-dev',
  env: 'dev'
}
