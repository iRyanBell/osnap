# oSnap.app

A decentralized social media tangle built with a distributed filesystem.

## Getting Started

```bash
# install dependencies
yarn

# start development server
yarn dev

# create production build
yarn build
```

## How It Works

A peer-to-peer swarm is constructed within the browser with libP2P, allowing direct uploads to a distributed content delivery network (via IPFS). Files are referenced by cryptographic hash-based identifiers, which are published to a blockchain (Ethereum) smart contract and pinned by a proof-of-replication cryptocurrency (Filecoin). The requirement for appending a new media post to the tangle is simple: two existing posts must be tipped.

<p align="center"><img alt="oSnap.app - Media Tangle Explained (Graphic)" src="https://user-images.githubusercontent.com/25379378/88954222-df11f700-d24e-11ea-880d-b4f03548afc3.png" /></p>

### View the dApp on the distributed web

https://ipfs.io/ipfs/QmSnGd9TxuYSJ3AWKBLaPDfcFA36FbThgkjqEDDTU33rvv/
