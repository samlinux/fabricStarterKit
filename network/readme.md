## Part 2 - Using the devNetwork
After we've successfully installed step 1, we can try the starter kit.

We assume the following folder structure, which should already exist.
```bash
root@jsday:~/fabric 

tree -L 1
.
├── fabric-samples
└── fabricStarterKit
```
Let's start the development network.

```bash
# switch into the cloned folder
cd fabricStarterKit

# start a new tmux terminal
tmux new -s dev

## Enable scrolling
CTRL + b :set -g mouse on

# --------------------
# in terminal 1
# --------------------
./network/devNetwork.sh up

#./network/devNetwork.sh up -ca
#./network/devNetwork.sh up -s (http://your-url:5984/_utils/#login)

# --------------------
# in terminal 2
# --------------------

# Start the chaincode in Node.js
cd chaincode/nodejs/starter

# install node_modules (for the first time)
npm install 

# start the chaincode by hand
CORE_CHAINCODE_LOGLEVEL=debug CORE_PEER_TLS_ENABLED=false CORE_CHAINCODE_ID_NAME=mycc:1.0 ./node_modules/.bin/fabric-chaincode-node start --peer.address 127.0.0.1:7052

# --------------------
# in terminal 3
# --------------------

# change some environment variables we need, this is the path to the fabric config yaml files based on the fabric-samples
export FABRIC_CFG_PATH=${PWD}/../fabric-samples/config

# how is connecting to the network
export CORE_PEER_MSPCONFIGPATH=/root/fabric/fabricStarterKit/network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

## Test the chaincode with  CLI commands during the chaincode development
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

## Stopping the development network
You can stop the development network.
```bash
# in terminal 1
./network/devNetwork.sh down
```

Alternatively, you can leave the development network and let it run in the background to continue your work later.

```bash
CTRL + b d
``` 

Now we are ready and switch to the client application.

[Back](../README.md#fabric-Developer-starter-kit) | [Next](../backend/readme.md)