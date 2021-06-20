## Running the devNetwork

```bash
# --------------------
# in terminal 1
# --------------------
./devNetwork.sh up
./devNetwork.sh up -ca
./devNetwork.sh up -s (http://your-url:5984/_utils/#login)

# --------------------
# in terminal 2
# --------------------

# Start the chaincode in go
CORE_CHAINCODE_LOGLEVEL=debug CORE_PEER_TLS_ENABLED=false CORE_CHAINCODE_ID_NAME=mycc:1.0 ./saac --peer.address 127.0.0.1:7052

## for Node.js
# Start the chaincode in Node.js
# for the first time
cd chaincode/go/sacc
npm install 

CORE_CHAINCODE_LOGLEVEL=debug CORE_PEER_TLS_ENABLED=false CORE_CHAINCODE_ID_NAME=mycc:1.0 ./node_modules/.bin/fabric-chaincode-node start --peer.address 127.0.0.1:7052


# --------------------
# in terminal 3
# --------------------

## Enable scrolling
CTRL + b :set -g mouse on

# set environment vars
source org1.sh
setGlobals

# test the chaincode
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode invoke -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["set","k1","hello world!"]}'

CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode query -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["get","k1"]}'
```

## Stopping the test network

```bash
# in terminal 1
./devNetwork.sh down
```
