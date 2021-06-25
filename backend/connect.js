/**
 * Hyperledger Fabric REST API
 * @rbole 
 */

const fs = require('fs');

'use strict';
module.exports =  function (config) {

  // We include to fabric requirements.
  const { Wallets, Gateway } = require('fabric-network');

  // We include the path to construct the connection profile.
  const path = require('path');

  // We create a promise.
  return new Promise (async (resolve, reject) => {

    // We construct the path to connection profile.
    const ccpPath = path.resolve(__dirname, config.ccpPath);
    const contents = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(contents);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), config.walletPath);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { 
      wallet, 
      identity: config.userName, 
      discovery: { enabled: false, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(config.channel);
    
    // Get the contract from the network.
    const contract = network.getContract(config.cc);

    // We construct our retour object.
    let result = {
      gateway: gateway,
      contract: contract
    }
    resolve(result);
    
  })
}