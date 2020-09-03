# tor-list-api
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This repository is a REST API server written in node.js and using [koa2](https://github.com/koajs/koa/tree/v2.x) (as opposed to express.js), and is based on this [koa-api-boilerplate](https://github.com/christroutner/koa-api-boilerplate).

This API is used to write to an [OrbitDB](https://orbitdb.org/) instance. The server also syndicates the database over the [IPFS](https://ipfs.io) network. The purpose of this p2p database is to curate links for the deep web; that is, sites on the Tor and IPFS networks. But it can also be used for curating clear web websites.

The API can be accessed at [api.torlist.cash](https://api.torlist.cash).

## License
[MIT](./LICENSE.md)
