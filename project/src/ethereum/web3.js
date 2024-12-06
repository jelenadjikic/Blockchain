const { Web3 } = require('web3'); 

let web3;

if(typeof window != 'undefined' && typeof window.web3 !== 'undefined'){
    // Metamask is available
    web3 = new Web3(window.web3.currentProvider);
    const accounts = await web3.eth.getAccounts();
    console.log("Metamask is available")
    console.log("Accounts: " + accounts)
} else {
    // Matamask is not available
    const provider = new Web3.providers.HttpProvider(
        ''
    );
    web3 = new Web3(provider);
    console.log("Metamask is NOT available")
}

export default web3;