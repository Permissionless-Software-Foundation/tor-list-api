
// Libraries
const IPFS = require('../../src/lib/ipfs')
const orbitDB = require('../../src/lib/orbitdb')
const ipfs = new IPFS()

const getDbEntries = async () => {
  try {
    // Start ipfs node
    const ipsfNode = await ipfs.startIPFS()

    // Get a handle on the OrbitDB node.
    const db = await orbitDB.startOrbit(ipsfNode)

    // Get the entries of the DB.
    const entries = db
      .get('')

    if (!entries.length) {
      console.log('There are no registered entries')
      return
    }
    for (const entry of entries) {
      console.log(' ')
      console.log(entry)
      console.log(' ')
    }

    console.log(`Total of entries : ${entries.length}`)
  } catch (error) {
    console.error(error)
  }
}

getDbEntries()
