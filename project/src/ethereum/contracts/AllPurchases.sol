// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;
import "./Purchase.sol";

contract AllPurchases {

    address payable [] public purchases;
    address payable [] public sellers;

    // Za svakog sellera pamti se par (adresa - struktura Seller)
    struct Seller {
        bool active;
        uint totalRate;
        uint numberOfTimesRated;
    }
    mapping(address  => Seller) public ratings;

    receive() external payable {
    }

    function createPurchase(string memory title, string memory description, string memory picture) public payable {
       
        Purchase purchase = new Purchase(title, description, picture, payable(msg.sender), msg.value);
        
        // Kada neki seller kreira novi purchase, on treba da pošalje 2*value itema, i taj novac treba da 
        // bude na računu tog contracta, međutim pozivom funkcije createPurchase, taj novac ide na račun factory contracta
        // pa zato taj novac factory contract treba da pošalje contractu purchase
        payable(purchase).transfer(msg.value);
        purchases.push(payable(purchase));

        // When new purchase is created, we set it to active
        if(!ratings[payable(msg.sender)].active){
            ratings[payable(msg.sender)].active = true;
            sellers.push(payable(msg.sender));
        }
    }

    function getSellers() public view returns(address payable[] memory){
        return sellers;
    }

    function getTotalRateForSeller(address payable seller) public view returns(uint){
        return ratings[seller].totalRate;
    }

     function getNumberOfTimesRatedForSeller(address payable seller) public view returns(uint){
        return ratings[seller].numberOfTimesRated;
    }

    function getPurchases() public view returns (address payable[] memory){
        return purchases;
    }

    mapping(address => mapping(address  => mapping( address  => bool))) public hasVoted;

    function canVote(address payable seller, address payable purchase, address payable voter) public view returns(bool) {
        if(voter == seller)
            return false;
        if(!ratings[seller].active)
            return false;
        if(Purchase(purchase).seller() != seller)
            return false;
        if(!Purchase(purchase).successful())
            return false;
        if(Purchase(purchase).buyer() != voter)
            return false;
        if(hasVoted[seller][purchase][voter])
            return false;
        else return true;
    }

    function vote(address payable seller, address payable purchase, uint8 rate) public {
        require(rate <= 5, "Rate has to be between 1 and 5!");
        require(canVote(seller, purchase, payable(msg.sender)), "Can not vote!");
        hasVoted[seller][purchase][payable(msg.sender)] = true;
        ratings[seller].totalRate += rate;
        ratings[seller].numberOfTimesRated++;
    }
}