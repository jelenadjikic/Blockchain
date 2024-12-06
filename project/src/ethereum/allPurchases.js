import web3 from './web3'
import allPurchases from './build/AllPurchases.json'
import {address} from './contractAddress'

export default () => {
    return new web3.eth.Contract(
        allPurchases.abi,
        address
    );
};