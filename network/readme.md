## Running the devNetwork

```bash
# switch into the cloned folder
cd fabricStarterKit

# start a new tmux terminal
tmux new -s dev

# --------------------
# in terminal 1
# --------------------
./network/devNetwork.sh up
./network/devNetwork.sh up -ca
./network/devNetwork.sh up -s (http://your-url:5984/_utils/#login)

# --------------------
# in terminal 2
# --------------------

## for Node.js
# Start the chaincode in Node.js
# for the first time
cd chaincode/nodejs/starter
npm install 

CORE_CHAINCODE_LOGLEVEL=debug CORE_PEER_TLS_ENABLED=false CORE_CHAINCODE_ID_NAME=mycc:1.0 ./node_modules/.bin/fabric-chaincode-node start --peer.address 127.0.0.1:7052

# --------------------
# in terminal 3
# --------------------

## Enable scrolling
CTRL + b :set -g mouse on


# change some environment variables
export FABRIC_CFG_PATH=${PWD}/../fabric-samples/config

# how is using connecting to the network
export CORE_PEER_MSPCONFIGPATH=/root/fabric/fabricStarterKit/network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

# create or update an asset
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode invoke -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["starter:set","{\"no\":\"a1\", \"desc\":\"Product number 1\",\"amount\":10, \"price\":\"500\"}"]}'

# query the world state of an asset
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode query -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["starter:get","a1"]}' | jq .

# query the history of an asset
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode query -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["starter:getHistory","a1"]}' | jq .

# query all assets
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode query -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["starter:getAllAssets"]}' | jq .

# delete an asset
CORE_PEER_ADDRESS=127.0.0.1:7051 peer chaincode invoke -o 127.0.0.1:7050 -C ch1 -n mycc -c '{"Args":["starter:delete","a1"]}'

```

## Stopping the test network

```bash
# in terminal 1
./devNetwork.sh down
```
