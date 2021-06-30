# Part 3 - Set-Up and run a Client Application
The client application is based on Node.js. We use an expressjs REST API to interact with the ledger and provide a public react frontend.

## Install Node.js requirements
First install the required node_modules.
```bash
# make sure you are in the backend folder
pwd
# > /root/fabric/fabricStarterKit/backend

# have a look into the package.json file if you are interested
npm install
```

## Add an User to the Wallet
The client application needs a user to interact with the ledger. We can use **User1@org1.example.com** which was created during the boot process. 

The second step is to add this user to the clients local filesystem wallet. We can do that with the following command.

```bash
node cli/addToWallet.js
# > done

# check the wallet
tree wallet

# you should see the following output
wallet
└── User1@org1.example.com.id

# feel free to inspect that file
cat wallet/User1@org1.example.com.id | jq .
```

## Install global helper if needed
We can install some global and common helper tools.

```bash
npm install nodemon mocha -g
```

## Start REST API
We need another tmux panel.

>**Create a new panel horizontally**<br> 
CTRL + b " (double-quots)

Start expressjs.
```bash
nodemon start index.js
```

## Test with cli commands
We need another tmux panel.
>**Create a new panel horizontally**<br> 
CTRL + b " (double-quots)

```bash
# call a specific test with mocha
# possible values ['api','setData','getData','delAsset','getAllAssets']

mocha -g "getAllAssets" cli/commands.js
```

[Index](../README.md#fabric-Developer-starter-kit) | [Back](../network/readme.md)
