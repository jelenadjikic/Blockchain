// Test za interaciju sa deployovanim contractom, isto sto i test samo radi sa kreiranim contractom na test merži
// Pokretanje node contractInteractions.js

const HDWalletProvider = require('truffle-hdwallet-provider');
const { Web3 } = require('web3'); 
const { address } = require('./contractAddress');
const bip39 = require('bip39')
const { hdkey } = require('ethereumjs-wallet')

const AllPurchases = require('./build/AllPurchases.json');
const Purchase = require('./build/Purchase.json');


console.log("Smart contract address: ", address);

// menomnici, endpoint
const mnemonics = ''
const provider = new HDWalletProvider(
    mnemonics,
    ''
)

// For accessing different addresses in one Metamask account 
const getAddressForIndex = async(i) => {
    const seed = await bip39.mnemonicToSeed(mnemonics);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const walletHdPath = ("m/44'/60'/0'/0/") + i;
    const walletAddress = hdWallet.derivePath(walletHdPath).getWallet().getAddressString();
    console.log("Wallet address:  ", walletAddress);
    return walletAddress;
}

const web3 = new Web3(provider);

const createPurchase = async () => {

    // All purchases
    const allPurchases = new web3.eth.Contract(
        AllPurchases.abi, 
        address
    );

    // Accounts
    console.log("Getting accounts...")
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts 0: " + accounts[0])
    console.log("Accounts 1: " + accounts[1])

    //Create purchase, seller is on index 0
    console.log(`Calling createPurchase...`);
    await allPurchases.methods.createPurchase(
        "Selling iPhoneX",
        "I am selling my iPhoneX. It is in great condition, I used it for only 3 months.",
        "slika1.jpg"
    ).send({
        from: accounts[0],
        gas: 6000000, 
        value: web3.utils.toWei('1', 'ether')
    });
    
    

    // get Purchases
    console.log("Getting created purchases...");
    const createdPurchases = await allPurchases.methods.getPurchases().call({from: accounts[0]});
    console.log(`Last created purchase address: ${createdPurchases[createdPurchases.length-1]}`)

    // Purchase
    const purchase = new web3.eth.Contract(
        Purchase.abi, 
        createdPurchases[createdPurchases.length-1]
    );


};

createPurchase();

