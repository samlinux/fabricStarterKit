/**
 * Hyperledger Fabric Node.js SDK REST API 
 * @rbole 
 */

// ----------------------------------------
// requirements
// ----------------------------------------

  // We include some requirement.
  const express = require('express');

  // We include our connection modul.
  let connectToContract = require('./connect');

  // We include our config file.
  let config = require('./config.json');

  // We define a global variable/pointer to catch an interrupt signal
  // and do a disconnect from the gateway.
  let gateway;

// ----------------------------------------
// express.js 
// ----------------------------------------

  // We create the express base instance.
  const app = express();

  // for parsing application/json
  app.use(express.json());

  // for parsing application/x-www-form-urlencoded 
  app.use(express.urlencoded({ extended: true }));

  // On start we connect to the gateway.
  connectToContract(config).then(function(connection){
    // Connection is established we are ready to start the API server.
    // We set the global gateway pointer to disconnect the connect on interruption.
    gateway = connection.gateway;

    console.log('- connection to fabric network ready')
    // -------------------------------------------
    // We implement the api endpoints.
    // All results are formatted as json strings.
    // -------------------------------------------
    let routeController = require('./routes/index.js')(connection)
    app.use('/api', routeController)

    // finally we start the api server
    app.listen(3000, function(){	
      console.log('- api server started listening on port 3000!');
    });	
  })

// ----------------------------------------
// we disconnect from the gateway CTRL + c
// ----------------------------------------
process.on('SIGINT', async function  () {
  console.log("Caught interrupt signal -  start disconnect from the gateway");
    // Disconnect from the gateway.
    await gateway.disconnect();
    process.exit();
});