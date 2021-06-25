'use strict';

// SDK Library to asset with writing the logic 
const { Contract } = require('fabric-contract-api');

/**
 * Chaincode Interface = dependencies of fabric-shim = old version
 * Contract Interface = dependencies of fabric-contract-api and fabric-shim will be required too = new version
 */
class Starter extends Contract {
    constructor(){
      // contractName
      super('starter');
      
      // DataModel
      this.Model = {};
      this.TxId = '';
    }

    beforeTransaction(ctx) {
      // default implementation is do nothing
      this.TxId = ctx.stub.txId;
      console.log('---------------------------');
      console.log('transaction start');
      console.log(`TxId: ${this.TxId}`);
    }

    afterTransaction(ctx, result) {
      console.log('transaction done, R: ',result);
      console.log('---------------------------');
    }

    unknownTransaction(ctx) {
      //Sending error message back to peer
      let ret = ctx.stub.getFunctionAndParameters();
      throw new Error(`CC method ${ret.fcn} not defined!`);
    }

    /**
     * 
     * @param {*} ctx 
     * @returns 
     */
    async set(ctx){
      
      // create the model and get the key
      this.createModel(ctx);

      try {
        // store the key
        const assetBuffer = Buffer.from(JSON.stringify(this.Model.data));
        await ctx.stub.putState(this.Model.key, assetBuffer);

        // compose the return values
        return {
          key: this.Model.key
        };

      } catch(e){
        throw new Error(`The tx ${this.TxId} can not be stored: ${e}`);
      }
    }

    /**
     * get the latest value of a key
     * 
     * @param {*} ctx 
     * @param {*} key 
     */
    async get(ctx, key){
      // get the asset from chaincode state
      const assetAsBuffer = await ctx.stub.getState(key); 

      // check if the asset key was found
      if (!assetAsBuffer || assetAsBuffer.length === 0) {
        throw new Error(`The asset ${key} does not exist`);
      }
      // convert the buffer to string
      return assetAsBuffer.toString('utf8');
    }

    /**
     * Deletes an asset
     * @param {*} ctx 
     * @param {*} key 
     * @returns 
     */
    async delete(ctx, key){
      const exists = await this.assetExists(ctx, key);
      if (!exists) {
          throw new Error(`The asset ${key} does not exist`);
      }
      return ctx.stub.deleteState(key);
    }
  
    /**
     * Create Model
     * product {no, desc, amount, price}
     * @param {*} data 
     */
    createModel(ctx){
      // get passed parameters
      const ret = ctx.stub.getFunctionAndParameters();

      // convert passed parameter to JSON     
      const data = JSON.parse(ret.params[0]);

      // start composing a data and key model
      this.Model.data = {};

      if(data.hasOwnProperty('no')){
        this.Model.key = data.no;
      }

      if(data.hasOwnProperty('desc')){
        this.Model.data.desc = data.desc;
      }

      if(data.hasOwnProperty('amount')){
        this.Model.data.amount = parseInt(data.amount);
      }

      if(data.hasOwnProperty('price')){
        this.Model.data.price = parseFloat(data.price);
      } 
    }

    /**
     * get the latest value of a key
     * @param {*} ctx 
     * @param {*} key 
     */
    async getHistory(ctx, key){
      // get the asset from chaincode state
      const promiseOfIterator = await ctx.stub.getHistoryForKey(key);
      const results = await this.getAllResults(promiseOfIterator);
      return JSON.stringify(results);
    }
    
    /**
     * GetAllAssets returns all assets found in the world state
     * @param {*} ctx 
     * @returns [{*}] 
     */
    async getAllAssets(ctx) {
      const allResults = [];
      // this is a range query with empty string for startKey and endKey 
      // does an open-ended query of all assets in the chaincode namespace
      const iterator = await ctx.stub.getStateByRange('', '');
      let result = await iterator.next();
      while (!result.done) {
          const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
          let record;
          try {
              record = JSON.parse(strValue);
          } catch (err) {
              console.log(err);
              record = strValue;
          }
          allResults.push({ Key: result.value.key, Record: record });
          result = await iterator.next();
      }
      return JSON.stringify(allResults);
    }

    /**
     * loop as long the iterator isn't done
     * @param {*} iterator 
     * @returns 
     */
    async getAllResults(iterator) {
      const allResults = [];
      let loop = true;
      while (loop) {
        const res = await iterator.next();
        if (!res.value && res.done) {
          await iterator.close();
          return allResults;
        } else if (!res.value) {
          throw new Error('no value and not done (internal error?)');
        }
        const theVal = res.value.value.toString('utf8');  
        const jsonVal = JSON.parse(theVal);
        jsonVal.txId =res.value.txId;
        allResults.push(jsonVal);
        if (res.done) {
          await iterator.close();
          loop = false;
          return allResults;
        }
      }
    }

    /**
     * AssetExists returns true when asset with given ID exists in world state.
     * @param {*} ctx 
     * @param {*} id 
     * @returns 
     */
    async assetExists(ctx, id) {
      const assetJSON = await ctx.stub.getState(id);
      return assetJSON && assetJSON.length > 0;
    }

};

module.exports = Starter