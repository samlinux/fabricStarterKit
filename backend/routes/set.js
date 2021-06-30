/**
 * Hyperledger Fabric REST API
 * @rbole 
 */

const _ = require('lodash');

  'use strict';
  module.exports = async function (req, contract) {
   
    // Get the keys and value from the POST request.
    console.log(_.get(req,'body',false))
    let no = _.get(req,'body.no',false);
    if(!no){
      return {r:'Failed to submit transaction: no valid set'};
    }

    let desc = _.get(req,'body.desc','');
    let amount = _.get(req,'body.amount','');
    let price = _.get(req,'body.price','');
   
    //  Set the keys to lowercase, because of the chaincode.
    no = no.toString().toLowerCase();
    
    let value = {'no':no, 'desc':desc, 'amount':amount, 'price':price};
    value = JSON.stringify(value);
    try {
        /* 
        Submit the specified transaction.
        Submit a transaction to the ledger. The transaction function name will be evaluated on the endorsing peers and then submitted to the ordering service for committing to the ledger. 
        */
        await contract.submitTransaction('starter:set', value);
      
      // Prepare the return value.
      let r = 'Transaction has been successfully submitted: '+no;
      return r;
    }
    catch(error){
      let r = {r:'Failed to submit transaction: '+error};
      return r;
   }
 }