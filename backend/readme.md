# Backend - expressjs REST API

## Install node_modules
```bash
npm install
```

## Convert Testuser
Add user User1@org1.example.com to the local fs wallet.
```bash
node cli/addToWallet.js
# > done

tree wallet

wallet
└── User1@org1.example.com.id
```

## Install global helper if needed

```bash
npm install nodemon mocha -g
```

## Start REST API
```bash
nodemon start index.js
```

## Test with cli commands

```bash
node cli/commands 
```

