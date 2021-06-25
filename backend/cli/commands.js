/**
 * test for our super fabric REST API
 */
const supertest = require('supertest');
const api = supertest('localhost:3000/api');
const util = require('util');
const invokeTimeout = 3000;

describe("Hyperledger fabricStarterKitAPI tests", function() {

  it("checks if api is running", async function() {
    this.skip();
    let result = await api.get('/')
    console.log(result.body)
  }) 
  
  it("create or update an assets", async function() {
    //this.skip();
    this.timeout(invokeTimeout);
    let payload = {
      no: 'a3',
      desc: 'Product number 1',
      amount: '1',
      price: '3200'
    };
    let result = await api.post('/setData').send(payload)
    console.log(result.body)
  })

  it("query a key", async function() {
    this.skip();
    let key = 'a3';
    let result = await api.get('/getData/'+key)
    console.log(result.body)
  })

  it("delete an asset", async function() {
    this.skip();
    this.timeout(invokeTimeout);
    let key = 'a3';
    let result = await api.get('/delAsset/'+key)
    console.log(result.body)
  })

  it("get all assets", async function() {
    //this.skip();
    let result = await api.get('/getAllAssets')
    console.log(util.inspect(result.body, { showHidden: false, depth: null }))
  })
  


})

