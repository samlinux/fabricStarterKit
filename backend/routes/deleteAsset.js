/**
 * Hyperledger Fabric REST API
 * @rbole 
 */
 const _ = require('lodash');

 'use strict';
 module.exports = async function (req, contract) {
 
   // Get the key from the GET request and set it to lowercase, because of the chaincode.
   let queryKey = _.get(req,'params.key',false);
   if(!queryKey){
    return {error:'noKeyToDelete'};
   }

   queryKey = queryKey.toLowerCase();

   try {
    
     let result = await contract.submitTransaction('starter:delete',queryKey);
     
     // Construct the finale return object.
     let r = {
       key: queryKey,
       value: result.toString()
     };
     return r;
   } catch(err){
     //console.log('Failed to evaluate transaction:', err)
     let r = {result:' The asset '+queryKey+' does not exist! '};
     return r; 
   }
 }