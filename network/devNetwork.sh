
# Export some environment vars
cd network

export PATH=${PWD}/../../fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx

# set mode: up or down
MODE=$1

# channel name set to "ch1"
CHANNEL_NAME="ch1"

# Using crpto vs CA. default is cryptogen
CRYPTO="cryptogen"

# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
MAX_RETRY=5

# default for delay between commands
CLI_DELAY=3

# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=docker/docker-compose-test-net.yaml

# docker-compose.yaml file if you are using couchdb
COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml

# certificate authorities compose file
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

# default image tag
IMAGETAG="latest"

# default ca image tag
CA_IMAGETAG="latest"
# default database
DATABASE="leveldb"

# parse cli params
for var in "$@"
  do
    if [ "$var" == "-ca" ]; then
      CRYPTO="Certificate Authorities"
    fi

    if [ "$var" == "-s" ]; then
      DATABASE="couchdb"
    fi
  done


# Print Info
function infoln() {
  echo -e "$1"
}

# Print echos
function println() {
  echo -e "$1"
}
# Print error and stop
function fatalln() {
  echo -e "$1"
  exit 1
}

# Print CLI help
function printHelp() {
  USAGE="$1"
  if [ "$USAGE" == "up" ]; then
    println "Usage: "
    println "  devNetwork.sh \033[0;32mup\033[0m [Flags]"
    println
    println "    Flags:"
    println "    -ca <use CAs> -  Use Certificate Authorities to generate network crypto material"
    println "    -s <use CouchDb> -  Use CouchDb as state database"
    println
    println " Examples:"
    println "   network.sh up "
    println "   network.sh up -ca "
    println "   network.sh up -ca -s "
  else
    println "Usage: "
    println "  devNetwork.sh up or down"
  fi
}

# create the network member certificates
function createOrgs() {
  if [ -d "organizations/peerOrganizations" ]; then
    rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
  fi

  # Create crypto material using cryptogen
  if [ "$CRYPTO" == "cryptogen" ]; then
    which cryptogen
    if [ "$?" -ne 0 ]; then
      fatalln "cryptogen tool not found. exiting"
    fi
    infoln "Generating certificates using cryptogen tool"

    infoln "Creating Org1 Identities"

    set -x
    cryptogen generate --config=./organizations/cryptogen/crypto-config-org1.yaml --output="organizations"
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "Failed to generate certificates..."
    fi

    infoln "Creating Orderer Org Identities"

    set -x
    cryptogen generate --config=./organizations/cryptogen/crypto-config-orderer.yaml --output="organizations"
    res=$?
    { set +x; } 2>/dev/null
    if [ $res -ne 0 ]; then
      fatalln "Failed to generate certificates..."
    fi

  fi

  # Create crypto material using Fabric CA
  if [ "$CRYPTO" == "Certificate Authorities" ]; then
    infoln "Generating certificates using Fabric CA"

    IMAGE_TAG=${CA_IMAGETAG} docker-compose -f $COMPOSE_FILE_CA up -d 2>&1

    . organizations/fabric-ca/registerEnroll.sh

  while :
    do
      if [ ! -f "organizations/fabric-ca/org1/tls-cert.pem" ]; then
        sleep 1
      else
        break
      fi
    done

    infoln "Creating Org1 Identities"
    createOrg1

    infoln "Creating Orderer Org Identities"
    createOrderer

  fi

  infoln "Generating CCP files for Org1"
  ./organizations/ccp-generate.sh
}

# Create the Genesis Block
function createConsortium() {
  which configtxgen
  if [ "$?" -ne 0 ]; then
    fatalln "configtxgen tool not found."
  fi

  infoln "Generating Orderer Genesis block"

  # Note: For some unknown reason (at least for now) the block file can't be
  # named orderer.genesis.block or the orderer will fail to launch!
  set -x
  configtxgen -profile OneOrgsOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block
  res=$?
  { set +x; } 2>/dev/null
  if [ $res -ne 0 ]; then
    fatalln "Failed to generate orderer genesis block..."
  fi
}

# Create and join the channel
function createAndJoinChannel(){

  configtxgen -channelID $CHANNEL_NAME -outputCreateChannelTx $(pwd)/artifacts/$CHANNEL_NAME.tx -profile OneOrgsChannel -configPath $(pwd)/configtx/

  peer channel create -o localhost:7050 -c $CHANNEL_NAME -f ./artifacts/${CHANNEL_NAME}.tx --outputBlock ./artifacts/${CHANNEL_NAME}.block
  
  peer channel join -b $(pwd)/artifacts/ch1.block
}

# approve the chaincode
function approveChaincode(){
  peer lifecycle chaincode approveformyorg  -o 127.0.0.1:7050 --channelID $CHANNEL_NAME --name mycc --version 1.0 --sequence 1  --signature-policy "OR ('Org1MSP.member')" --package-id mycc:1.0

  sleep $CLI_DELAY
  peer lifecycle chaincode commit -o 127.0.0.1:7050 --channelID $CHANNEL_NAME --name mycc --version 1.0 --sequence 1  --signature-policy "OR ('Org1MSP.member')" --peerAddresses 127.0.0.1:7051
}

# Start the network
function networkUp() {

  # generate artifacts if they don't exist
  if [ ! -d "organizations/peerOrganizations" ]; then
    createOrgs
    createConsortium
  fi

  COMPOSE_FILES="-f ${COMPOSE_FILE_BASE}"

  if [ "${DATABASE}" == "couchdb" ]; then
    COMPOSE_FILES="-f ${COMPOSE_FILE_COUCH}"
  fi

  IMAGE_TAG=$IMAGETAG docker-compose ${COMPOSE_FILES} up -d  2>&1
  
  docker ps -a
  if [ $? -ne 0 ]; then
    infoln "Unable to start network"
  fi
  source startup.sh
  
  sleep 2
  createAndJoinChannel
  sleep 2
  approveChaincode
  
  # show logging comment it out if needed
  docker-compose ${COMPOSE_FILES} logs -f
}

# Tear down running network
function networkDown() {
  # stop org1 and org2
  docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans

  # remove orderer block and other channel configuration transactions and certs
  docker run --rm -v $(pwd):/data busybox sh -c 'cd /data && rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations'
  ## remove fabric ca artifacts
  docker run --rm -v $(pwd):/data busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org1/msp organizations/fabric-ca/org1/tls-cert.pem organizations/fabric-ca/org1/ca-cert.pem organizations/fabric-ca/org1/IssuerPublicKey organizations/fabric-ca/org1/IssuerRevocationPublicKey organizations/fabric-ca/org1/fabric-ca-server.db'
  docker run --rm -v $(pwd):/data busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/ordererOrg/msp organizations/fabric-ca/ordererOrg/tls-cert.pem organizations/fabric-ca/ordererOrg/ca-cert.pem organizations/fabric-ca/ordererOrg/IssuerPublicKey organizations/fabric-ca/ordererOrg/IssuerRevocationPublicKey organizations/fabric-ca/ordererOrg/fabric-ca-server.db'

  # remove channel and script artifacts
  docker run --rm -v $(pwd):/data busybox sh -c 'cd /data && rm -rf artifacts log.txt *.tar.gz'
 
}

# ------------------
# final script controller
# ------------------
if [ "${MODE}" == "up" ]; then
  networkUp
elif [ "${MODE}" == "down" ]; then
  networkDown
else
  printHelp
  exit 1
fi


