/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { Wallets } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../network/organizations/peerOrganizations');

// config
let config = {
  pathToUser:'/org1.example.com/users/User1@org1.example.com',
  pathToUserSignCert: '/msp/signcerts/User1@org1.example.com-cert.pem',
  pathToUserPrivKey: '/msp/keystore/priv_sk',
  identityLabel: 'User1@org1.example.com'
}

async function main() {

  // Main try/catch block
  try {

    // A wallet stores a collection of identities
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    // Identity to credentials to be stored in the wallet
    const credPath = path.join(fixtures, config.pathToUser);
    const cert = fs.readFileSync(path.join(credPath, config.pathToUserSignCert)).toString();
    const key = fs.readFileSync(path.join(credPath, config.pathToUserPrivKey)).toString();

    // Load credentials into wallet
    const identityLabel = config.identityLabel;
    const x509Identity = {
      credentials: {
          certificate: cert,
          privateKey: key,
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put(identityLabel, x509Identity);

  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
  }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});