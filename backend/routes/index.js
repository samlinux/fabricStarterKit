'use strict';
/**
 * @author rbole/SDG - samlinux development group
 * 2021
 */

(function(){

  // we include our API endpoint code.
  const getKeyData = require('./get');
  const setData = require('./set');
  const getAllAssets = require('./getAllAssets');
  const deleteAsset = require('./deleteAsset');

	module.exports = function(connection){
    let express = require('express'), router = express.Router();
    
    // logging
    router.use((req, res, next) => {
      console.log(req.url);
      next()
    })
  
    // import all routes    
    
    /**
     * We check if API is running.
     */
    router.get('/', function (req, res) {
      res.json({msg:'hello fabric api'});
    })

    /**
     * create or update an asset
     */
    router.post('/setData', async function (req, res) {
      let result = await setData(req, connection.contract)
      res.json(result);
    })

    /**
     * Get the value of a given key
     * @apiParam {string} key 
     */
    router.get('/getData/:key', async function (req, res) {
      let result = await getKeyData(req, connection.contract)
      res.json(result);
    })

    /**
     * Get all assets (undeleted)
     * @apiParam {string} key 
     */
     router.get('/getAllAssets', async function (req, res) {
      let result = await getAllAssets(req, connection.contract)
      res.json(result);
    })

    /**
     * Delete an assets
     * @apiParam {string} key 
     */
     router.get('/delAsset/:key', async function (req, res) {
       console.log('as')
      let result = await deleteAsset(req, connection.contract)
      res.json(result);
    })

		return router;
	};
})();
