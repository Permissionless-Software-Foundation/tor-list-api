# Developer Documentation

This is living documentation that will be updated, edited, and changed over time, using the same version control as the rest of the code. The purpose of this documentation is to capture and explain the inner workings of the permissionless, censorship-resistant database driving tor-list.

# Overview

There are three major pieces of software behind the tor-list concept:

![tor-list major subcomponents](./diagrams/software-interaction.png)

- [tor-list-frontend](https://github.com/Permissionless-Software-Foundation/tor-list-frontend) is the web based user interface (UI) which can seen at [TorList.cash](https://torlist.cash/).
- [tor-list-api](https://github.com/Permissionless-Software-Foundation/tor-list-api) is the back end REST API that maintains a local database of information that tor-list-frontend reads from.
- [P2WDB] is the [pay-to-write-orbitdb](https://github.com/Permissionless-Software-Foundation/pay-to-write-orbitdb) REST API that infaces to the global peer-to-peer (p2p) database.

The arrows in the image represent the information flow between the three pieces of software:

- tor-list-frontend displays information about websites. It _reads_ this information from tor-list-api.
- tor-list-frontend is also a web wallet. It can generate the needed transactions to _write_ information to the P2WDB.
- tor-list-api imports data from the global database into its local database using [OrbitDB replication events](https://github.com/orbitdb/orbit-db/blob/main/GUIDE.md#replicating-a-database).
