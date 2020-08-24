/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

module.exports = {
  port: process.env.PORT || 5001,
  logPass: 'test',
  emailServer: process.env.EMAILSERVER
    ? process.env.EMAILSERVER
    : 'mail.someserver.com',
  emailUser: process.env.EMAILUSER
    ? process.env.EMAILUSER
    : 'noreply@someserver.com',
  emailPassword: process.env.EMAILPASS
    ? process.env.EMAILPASS
    : 'emailpassword',

  ipfsOptions: {
    repo: './orbitdb/examples/ipfs',
    start: true,
    EXPERIMENTAL: {
      pubsub: true
    },
    config: {
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/5004', '/ip4/190.198.70.169/tcp/5005/ws'],
        API: '/ip4/190.198.70.169/tcp/5006',
        Gateway: '/ip4/190.198.70.169/tcp/5007',
        Delegates: []
      }
    },
    relay: {
      enabled: true, // enable circuit relay dialer and listener
      hop: {
        enabled: true // enable circuit relay HOP (make this node a relay)
      }
    },
    pubsub: true
  },

  orbitOptions: {
    repo: './orbitdb/examples/orbit'
  }
}
