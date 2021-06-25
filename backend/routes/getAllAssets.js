/**
 * Hyperledger Fabric REST API
 * @rbole 
 */

 'use strict';
 module.exports = async function (req, contract) {
 
   try {
     
     /*
     Evaluate the specified transaction.
     Evaluate a transaction function and return its results. The transaction function name will be evaluated on the endorsing peers but the responses will not be sent to the ordering service and hence will not be committed to the ledger. This is used for querying the world state. 
     */
     let result = await contract.evaluateTransaction('starter:getAllAssets');
     
     // Construct the finale return object.
     let r = {
       value: JSON.parse(result.toString())
     };
     return r;
   } catch(err){
     //console.log('Failed to evaluate transaction:', err)
     let r = {result:'Failed to evaluate transaction: '+err};
     return r; 
   }
 }