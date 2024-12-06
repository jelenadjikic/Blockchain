// Slanje pametnog ugovora na test mrežu, Pokretanje: node deploy.js
const path = require('path');
const fs = require('fs-extra');
const HDWalletProvider = require('truffle-hdwallet-provider');

const { Web3 } = require('web3'); 
const AllPurchases = require('./build/AllPurchases.json');

// menomnici, endpoint
const provider = new HDWalletProvider(
    'mnemonics',
    ''
)
const web3 = new Web3(provider);

const deploy = async () => {
    console.log('Starting deployment...');
    const accounts = await web3.eth.getAccounts();
    console.log('Accounts:  ' , accounts);
    console.log('Attempting to deploy from account (accounts[0]): ', accounts[0]);

    let result;
    try{
        result = await new web3.eth.Contract(AllPurchases.abi)
                .deploy({ data: '0x' + AllPurchases.evm.bytecode.object, arguments: [] })
                .send({ from: accounts[0] });
    }
    catch(err){
        console.log('Error: ', err);
    }

    // Creating file contractAddress.js which will contain address of deployed contract
    console.log('Deployment completed! ');
    fs.outputFileSync(path.resolve(__dirname, 'contractAddress.js'),
                    `const address = '${result.options.address}';\nmodule.exports = { address };\n`)
    console.log("Address of deployed contract is: ", result.options.address);
}

deploy();
