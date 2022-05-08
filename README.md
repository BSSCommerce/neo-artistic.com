# General Info
Neo-artistic.com is a NFT marketplace on NEO N3 Blockchain. This project includes four source code folder:

- Neo-artistic-api: 
  - Handle & manipulate data returned from Smart Contracts. 
  - Provide REST APIs for dApp to get structured data.
  - Use [Java (1.8)](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html), [Neow3j (3.16)](https://neow3j.io/#/), [Spring Boot (2.5.13)](https://start.spring.io/) with Maven build tool.
  - End-points: 
- Neo-artistic-front-page: 
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
  - Bss.neo.BinanceManagerContract: smart contract to get price from Binance public api, using Neo Oracle Service
  - Bss.neo.ProviderManagerContract: smart contract for registering multiple price source, but it is not ready and still testing phase
  - Use 100% [Neow3j (3.16)](https://neow3j.io/#/)
- Neo-artistic-stats-dapp
  - Display reports & statistics of NFT marketplace
  - Use [NextJS (11)](https://nextjs.org/)