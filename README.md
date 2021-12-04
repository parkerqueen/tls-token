# TLSToken

TLSToken is a very unadorned smart contract, implementing a web-of-trust model. The underlying idea is that a user can self-publish their TLS certificates while other peers in the network can sign those certificates. An entity can then receive all the accumulated signatures of a certificate with the expecatation that they will trust at least one or two of those signatures. Web-of-trust is essentially an antagonist to the centralized chain-of-trust PKI.

*This smart contract definitely does not support the X.509 standard specification for TLS certificates. TLS certificate, in our context, is just a few handpicked attributes along with an RSA public key.*

## Instructions
* Make sure to have `node` & `npm` installed.
* Clone this repository and run `npm install`.
* You can compile the smart contract by running `npx hardhat compile`.
* You can execute the tests by running `npx hardhat test`.
* For deployment on a remote test network, see the section below.

## Deployment
* Sign up on Alchemy and Etherscan and copy the API keys.
* Sign up for a Metamask wallet and get the private key for the Kovan test network. You may use other test networks as well. You'll need some test ethers as well which you can get for free from [here](https://faucet.kovan.network/).
* Edit `hardhat.config.js` and input all the API keys. Uncomment any lines. Then run:
```
npx hardhat run scripts/deploy.js --network kovan
```
* Running the above command will output a Token Address. Copy that and run the following:
```
npx hardhat verify --network kovan  <TOKEN_ADDRESS>
```
Running this will output an etherscan URL which you can use to obtain the ABI for the source code. This will come in handy when building a frontend to interact with the smart contract. I recommend using web3.js.

## Notes  
* Use bytes instead of strings. Strings are costly.
* Use IPFS distributed storage instead of storing the certificates/signatures directly on the network.
* Add more functionality?

## Contributors
* [parkerqueen](https://github.com/parkerqueen)
* [Farrukh-Ahmed-01](https://github.com/Farrukh-Ahmed-01)
