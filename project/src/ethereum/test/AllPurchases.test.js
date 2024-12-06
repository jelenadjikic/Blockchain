// Testing contract functionalities, Run test - npm run test
const assert = require('assert');
const ganache = require('ganache-cli');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const AllPurchases = require('../build/AllPurchases.json');
const Purchase = require('../build/Purchase.json');

let accounts;
let allPurchases;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    allPurchases = await new web3.eth.Contract(AllPurchases.abi) 
        .deploy({ data: AllPurchases.evm.bytecode.object })
        .send({ from: accounts[0], gas: '6000000' });
});

describe('All purchases testing', () => { 
    it('deploys a contract', () => {
       console.log("Accounts: " + accounts)
       assert.ok(allPurchases.options.address)
    });
})



describe('\n Purchase testing', () => {

    // Create purchase, seller is accounts[1]
    beforeEach('\n calls createPurchase', async () => {
        await allPurchases.methods.createPurchase(
            "Item 1 title",
            "Item 1 description",
            "Item 1 picture"
        ).send({
            from: accounts[1], 
            gas: 6000000, 
            value: web3.utils.toWei('2', 'ether')
        });
    })

    // About purchase
    it('\n About purchase', async () => {
        console.log("\n Getting info about the purchase...")
        const allPurchasesAddresses = await allPurchases.methods.getPurchases().call({from: accounts[0]});
        const purchase = new web3.eth.Contract(Purchase.abi, allPurchasesAddresses[0]);
        assert.ok(purchase)

        // All sellers
        const allSellers = await allPurchases.methods.getSellers().call({from: accounts[0]});
        assert.ok(allSellers)
        console.log("All sellers: ", allSellers);

        const title = await purchase.methods.title().call();
        assert(title, "Item 1 title");
        console.log("Title: ", title);

        const description = await purchase.methods.description().call();
        assert(description, "Item 1 description");
        console.log("Description: ", description);
        
        const value = await purchase.methods.value().call();
        assert(web3.utils.fromWei(value, 'ether'), "1");
        console.log("Value: ", web3.utils.fromWei(value, 'ether'), " ether");

        const balance = await purchase.methods.getBalance().call();
        assert(web3.utils.fromWei(balance, 'ether'), "2");
        console.log("Balance when created: ", web3.utils.fromWei(balance, 'ether'), " ether");

        const state = await purchase.methods.state().call();
        assert(state.toString(), "0")
        console.log("State when created: ", state.toString());

        const success = await purchase.methods.successfull().call();
        console.log("Success when created: ", success);

        const seller = await purchase.methods.seller().call();
        assert(seller, accounts[1])
        console.log("Seller: ", seller);
    })

     // Abort purchase - onlySeller in state 0
     it('\n Abort purchase...', async () => {
        const allPurchasesAddresses = await allPurchases.methods.getPurchases().call({from: accounts[0]});
        const purchase = new web3.eth.Contract(Purchase.abi, allPurchasesAddresses[0]);
        assert.ok(purchase)

        console.log("\n Aborting the purchase...")
        await purchase.methods.abort()
            .send({
                from: accounts[1], 
                gas: 6000000
            });

        const balance = await purchase.methods.getBalance().call();
        assert(web3.utils.fromWei(balance, 'ether'), "0.");
        console.log("Balance after aborting: ", web3.utils.fromWei(balance, 'ether'), " ether");

        const state = await purchase.methods.state().call();
        assert(state.toString(), "2")
        console.log("State after aborting: ", state.toString());

        const success = await purchase.methods.successfull().call();
        console.log("Success after aborting: ", success);

    })
    
    // Confirm purchase and confirm receiving item - onlyBuyer
    it('\n Confirm purchase and confirm receiving item, and then rate the seller...', async () => {
        
        const allPurchasesAddresses = await allPurchases.methods.getPurchases().call({from: accounts[0]});
        const purchase = new web3.eth.Contract(Purchase.abi, allPurchasesAddresses[0]);
        assert.ok(purchase)

        // Confirm purchase
        console.log("\n Confirm purchase...Deposit 2*value of item...")
        await purchase.methods.confirmPurchase()
            .send({
                from: accounts[2], 
                gas: 6000000, 
                value: web3.utils.toWei('2', 'ether')
            })

        const buyer = await purchase.methods.buyer().call();
        assert(buyer, accounts[2]);
        console.log("Buyer: ", buyer);

        let state = await purchase.methods.state().call();
        assert(state.toString(), "1");
        console.log("State after confirming purchase: ", state.toString());

        let balance = await purchase.methods.getBalance().call();
        assert(web3.utils.fromWei(balance, 'ether'), "4");
        console.log("Balance after confirming purchase: ", web3.utils.fromWei(balance, 'ether'), " ether");

        // Confirm receiving item
        console.log("\n Confirm receiving item...")
        await purchase.methods.confirmReceived()
            .send({
                from: accounts[2], 
                gas: 6000000
            });
        
        state = await purchase.methods.state().call();
        assert(state.toString(), "2");
        console.log("State after confirming that item was received: ", state.toString());

        balance = await purchase.methods.getBalance().call();
        assert(web3.utils.fromWei(balance, 'ether'), "0.");
        console.log("Balance after confirming that item was received: ", web3.utils.fromWei(balance, 'ether'), " ether");

        const success = await purchase.methods.successfull().call();
        console.log("Success after purchase: ", success);

        // Rate the seller
        console.log("\n Rating the seller...")
        const seller = await purchase.methods.seller().call();
        assert(seller, accounts[1]);
        await allPurchases.methods.vote(seller, allPurchasesAddresses[0], 4)
                .send({
                    from: accounts[2], 
                    gas: 6000000
                });
       const rate = await allPurchases.methods.getTotalRateForSeller(seller).call({from: accounts[2]});
       assert(rate, 4)
       console.log("Total rate for seller  ", seller, " is ", rate);
    })
    
})


