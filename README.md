# fabricStarterKit
A starter kid for node.js fabric developers

## Preparations

Installaton on a MacBook.

- Docker is installed
- node.js is installed



```bash
# bring up the network
./network.sh up createChannel -c mychannel

# install default CC - asset-transfer (basic) chaincode
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccv 1 -ccl javascript
```
