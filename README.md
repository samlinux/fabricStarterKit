# fabricStarterKit
A starter kid for node.js fabric developers

Installation structure.
root@fabric04:~# tree -L 2
.
├── fabric
    ├── fabric-samples
    └── fabricStarterKit
    
## Preparations on a MacBook

- Docker is installed
- node.js is installed

```bash
# bring up the network
./network.sh up createChannel -c mychannel

# install default CC - asset-transfer (basic) chaincode
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccv 1 -ccl javascript
```

## Preparations on a Ubuntu 20.04 LTS
This is the preferred setup.


## Install the fabricStarterKit



g++ for backend