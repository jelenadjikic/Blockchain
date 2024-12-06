import web3 from './web3'
const Purchase = require('./build/Purchase.json');

export default (address) => {
    return new web3.eth.Contract(
        Purchase.abi,
        address
    )
}