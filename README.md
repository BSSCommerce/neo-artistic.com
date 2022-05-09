# General Info
Neo-artistic.com is a NFT marketplace on NEO N3 Blockchain (TESTNET). This project need to resolve security issues & improve smart contracts ready for production (MAINNET).
Its source code includes folders:

- Neo-artistic-api: 
  - End-points: [neo-api.neo-artistic.com](https://neo-api.neo-artistic.com)
  - Handle & manipulate data returned from Smart Contracts. 
  - Provide REST APIs for dApp to get structured data.
  - Use [Java (1.8)](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html), [Neow3j (3.16)](https://neow3j.io/#/), [Spring Boot (2.5.13)](https://start.spring.io/) with Maven build tool.

- Neo-artistic-front-page: 
  - Website: [neo-artistic.com](http://neo-artistic.com/)
  - Display NFTs
  - Sell & buy NFTs
  - Add auctions & accept auctions
  - Connect with [NeoLine wallet](https://neoline.io/en/)
  - Integrate with [NeoFS](https://fs.neo.org/)
  - Use [NextJS (11)](https://nextjs.org/), [Material UI](https://mui.com/)
  - Use [Google Protobuf](https://www.npmjs.com/package/google-protobuf), [gRpc-web](https://www.npmjs.com/package/grpc-web)
  - Use [neon-js](https://www.npmjs.com/package/@cityofzion/neon-js), [neo-wallet-adapter](https://github.com/rentfuse-labs/neo-wallet-adapter)
- Neo-artistic-smart-contracts:
  - Include smart contracts for NFT and Oracle
  - BSS.NeoArtistic.NFTMarket: smart contract for NFT marketplace
  - Bss.neo.BinanceManagerContract: smart contract to get price from Binance public api, using Neo Oracle Service.
  - Bss.neo.ProviderManagerContract: smart contract for registering multiple price source, but it is not ready and still testing phase.
  - Use 100% [Neow3j (3.16)](https://neow3j.io/#/)
- Neo-artistic-stats-dapp:
  - Website: [stats.neo-artistic.com](https://stats.neo-artistic.com/)
  - Display reports & statistics of NFT marketplace
  - Use [NextJS (11)](https://nextjs.org/), [Material UI](https://mui.com/)

# System Diagram
The beginning idea was changed because there were some technical issues. So we will show both old & new system diagrams:

- Old diagram: ![old_diagram](docs/img/marketplace_diagram_old.jpg)
- New diagram: ![new_diagram](docs/img/marketplace_diagram_new.jpg)

#### First difference comes from connections with the NEOFS system. There are reasons:
- Our api uses Java while NEOFS supports Go/C#.
- User must upload file and mint NFT in one action. If we use other APIs from backend, that process becomes complicated more than needed.
- We want to upload/download file on the web-app directly.

#### Second difference comes from invoking smart contracts. There are reasons:
- Some transactions must be done with connected wallet, so they should be done from web-app instead of APIs.
- APIs need some credential information to do transactions, but we will get security issues if we send some credential information to API.

#### The new diagram is selected to explain how the system works.
- 1 - Smart Contracts using Neow3j library:
  - BSS.NeoArtistic.NFTMarket: smart contract for NFT marketplace
  - Bss.neo.BinanceManagerContract: smart contract to get price from Binance public api
- 2 - Restful APIs to get data from Blockchain via smart contracts:
  - List all NFTs: returned data will be converted to List<NFTToken> 
  - Get NFTs of a wallet address: returned data will be converted to List<NFTToken>
  - Get a NFT properties: returned data will be converted to NFTToken
  - Get NEO-USDT price via Oracle smart contract (Bss.neo.BinanceManagerContract)
- 3 - NFT Marketplace requests data from Restful API endpoints
  - /tokens: get all NFTs.
  - /tokens-of: get NFTs of a wallet address.
  - /neo-price: get NEO in USDT
  - /get-token-by-id: get NFT by id
  - All returned data is JSON format.
- 4 - NFT Marketplace connect to NeoLine wallet
  - To mint NFT
  - To add NFT auctions
  - To change NFT price & royalty
  - To accept auction & start transaction.
- 5 - NFT Marketplace use NEO-WALLET adapter & NEO-JS library
  - To connect with NeoLine
  - To invoke function from smart contracts
- 6 - NFT Marketplace connect to NEOFS Gateway
  - Use upload/<container_id> to upload file to container Id
  - Use get/<container_id>/<object_id> to get file
  - NEOFS Gateway domain: [neo-fs.bsscommerce.com](https://neo-fs.bsscommerce.com)
- 7 - NEOFS NODE provides gRPC endpoints
  - To connect with NeoFS gateway
  - To create container from web-app via web-gRPC
  - NEOFS NODE with Envoy Proxy: [neo-fs-rpc.neo-artistic.com](https://neo-fs-rpc.neo-artistic.com)
- 8 - Stats dAPP get data from Restful API
  - Get NFTs data to analyze

This is a simple diagram show how dAPP and NEOFS work together:

![nft marketplace and neofs](docs/img/nftmarketplace_neofs_diagram.jpg)

You can try to create your own container ID and upload testing files at here: [https://neo-artistic.com/upload](https://neo-artistic.com/upload)

![nft marketplace - neofs flow](docs/img/nftmarketplace_neofs_flow.jpg)

NEOFS Contract Address is `NadZ8YfvkddivcFFkztZgfwxZyKf1acpRF`

_To make minting NFT process easy, dApp doesn't require transfer GAS or create container ID. dApp uses default account!._

# NFT Marketplace Reference Implementation
- [Neow3j library](https://neow3j.io/#/)
- [NEP-11 Tutorial](https://developers.neo.org/tutorials/neow3j-nep11)
- [Oracle Implementation](https://github.com/neow3j/neow3j-examples-java/tree/master/src/main/java/io/neow3j/examples/contractdevelopment/contracts)
- [Neo Wallet Adapter](https://github.com/rentfuse-labs/neo-wallet-adapter)
- [NeoLine for N3](https://neoline.io/dapi/N3.html)
- [NeoFS demo (not up to date)](https://github.com/CityOfZion/neofs-demo/)
- [NeoFS HTTP Gateway](https://github.com/nspcc-dev/neofs-http-gw)
- [NeoFS Node](https://github.com/nspcc-dev/neofs-node)
- [NeoFs API](https://github.com/nspcc-dev/neofs-api)
- [gRPC-Web](https://github.com/grpc/grpc-web)
- [gRPC-web and protoc plugin to generate JS from .proto](https://github.com/grpc/grpc-web/releases)

# Progress:
- [x] NFT & Market smart contracts following NEP-11
- [x] demo pay out royalties (FTs and NEO)
- [x] test and determine standards for markets (best practice?) to buy/sell NFTs (finish standard) with FTs (already standard)
- [x] demo some basic auction types
- [x] frontend with MUI (Material Design - React UI components )
- [x] first pass / internal audit
- [x] integrate with NeoFS IPFS
- [x] integrate with Binance open API - convert NEO to USD
- [x] use MongoDB to store extra profile data such as profile name, collection, banner, logo...
- [x] implement simple collection feature: each near wallet account has a collection name.
- [x] show collections & NFTs on home page
- [x] show related NFTs item on NFT detailed page.
- [ ] NFT DEFI with landing, borrow and staking.
- [ ] implement NFT portal switch between chains (NEO, NEAR, Aurora, XRP, Ethereum...)

# Tech Stack
- [NextJS 11](https://nextjs.org/)
- [Mongo Atlas](https://www.mongodb.com/atlas/database)
- [MUI](https://mui.com/)
- [Java - Neow3j library](https://neow3j.io/#/)
- [Java - Spring Boot](https://start.spring.io/)
- [Neo Wallet Adapter](https://github.com/rentfuse-labs/neo-wallet-adapter)
- [gRPC-Web](https://github.com/grpc/grpc-web)
- [NeoFS](https://fs.neo.org/)

# Installation
## NeoFS
### Install docker
- Follow [this guide](https://docs.docker.com/engine/install/ubuntu/)
### NeoFS gRPC node
- Clone [neofs-node source code](https://github.com/nspcc-dev/neofs-node/tree/master/config/testnet)
- Follow [this guide](https://github.com/nspcc-dev/neofs-node/tree/master/config/testnet) to prepare docker image for testnet.
- Check [our example](docs/neofs-node/config/testnet)
- Use `docker-compose up -d` to start NeoFS node as a service.
- Use `docker-compose down` to shut down.
### Envoy proxy
- Install [Envoy proxy](https://www.envoyproxy.io/docs/envoy/latest/start/install)
- Create config.yaml.
- Check [our example](docs/neofs-node/config.yaml), change `139.162.44.177` to your public server IP.
- Use this command to run Envoy Proxy `envoy -c /var/www/html/neofs-node/config.yaml`
- To start as a service, you can read [this document](https://www.linode.com/docs/guides/start-service-at-boot/)
### NeoFS HTTP gateway
- Clone [neofs-http-gw source code](https://github.com/nspcc-dev/neofs-http-gw)
- Follow [this guide](https://github.com/nspcc-dev/neofs-http-gw)
- Change settings in [config folder](https://github.com/nspcc-dev/neofs-http-gw/tree/master/config)
- Use this command to start NeoFS GW `[path to neofs gw source code]/bin/neofs-http-gw --config [path to neofs gw source code]/config/config.yaml`
- To start as a service, you can read [this document](https://www.linode.com/docs/guides/start-service-at-boot/)
## NEO tools
### CLI
- Follow [this guide](https://docs.neo.org/docs/en-us/node/cli/setup.html)
### GUI
- Follow [this guide](https://docs.neo.org/docs/en-us/node/gui/install.html)
- To synchronize data faster, follow [this guide](https://docs.neo.org/docs/en-us/node/syncblocks.html)
- Please wait 1->2 hours to complete this process.
![NEO-GUI-SYNC-DATA](docs/img/sync_data.jpg)
![COMPLETE-SYNC](docs/img/complete_sync_data.jpg)
# Working
## Smart contracts
### NFT marketplace contract
- Go to NonFungibleToken folder, run command `./gradlew neow3jCompile`
- Use NEO-GUI or NEO-CLI to build smart contracts
![neo-gui-deploy](docs/img/deploy_contract.jpg)
### Oracle Contract
- Go to BinanceProvider folder, run command `./gradlew neow3jCompile`
- Use NEO-GUI or NEO-CLI to build smart contracts
## Restful API
- Install Java JDK 1.8.
- Install Maven.
- Go to neo-artistic-api folder, run command `./mvnw clean package`
- To start web Java application, run command `java -jar target/nftservices-0.1.0-SNAPSHOT.jar`
- To change port of application, go to file NFTServiceApplication.java and edit port.
## NFT marketplace frontpage

- All generated gRPC-web files are available in folder [generated](neo-artistic-front-page/src/generated). If you want to update:
  - Clone [neofs-api source code]((https://github.com/nspcc-dev/neofs-api))
  - Install [protoc](https://github.com/grpc/grpc-web/releases)
  - Generate JS from .proto, for example `protoc --proto_path="." --grpc-web_out=import_style=commonjs,mode=grpcwebtext:"./generated"  ./container/*.proto`
- Run command `npm i`
- Change your smart contract address and NEOFS endpoints in files
  - [Neofs.jsx](neo-artistic-front-page/src/lib/neofs.js)
  - [NftInfo.jsx](neo-artistic-front-page/src/components/nft/NftInfo.jsx)
  - [create.jsx](neo-artistic-front-page/src/pages/create.jsx)
- Run command `npm run build`
- Run command `npm run start`

## NFT marketplace statistic page
- Run command `npm i`
- Run command `npm run build`
- Run command `npm run start`

To manage react-app, you can use [PM2](https://pm2.keymetrics.io/)



