// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Purchase {

    uint public value;
    address payable public seller;
    address payable public buyer;

    string public title;
    string public description;
    string public picture;

    enum State { Created, Locked, Inactive }
    State public state;
    bool public successful;

    // Ensure that `msg.value` is an even number.
    // Division will truncate if it is an odd number.
    // Check via multiplication that it wasn't an odd number.
    constructor(string memory _title, string memory _description, string memory _picture, address payable _seller, uint _value){
        title = _title;
        description = _description;
        picture = _picture;
        seller = _seller;
        value = _value / 2;
        successful = false;
        require((2 * value) == _value, "Value has to be even.");
    }
    
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            payable(msg.sender) == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            payable(msg.sender) == seller,
            "Only seller can call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort() public onlySeller inState(State.Created){
        emit Aborted();
        state = State.Inactive;
        successful = false;
        seller.transfer(2*value);
    }

    receive() external payable {
        //confirmPurchase();
    }

    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase() public inState(State.Created) condition(msg.value == (2 * value)) payable {
        emit PurchaseConfirmed();
        buyer = payable(msg.sender);
        state = State.Locked;
    }

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived() public onlyBuyer inState(State.Locked) {
        emit ItemReceived();
        state = State.Inactive;

        buyer.transfer(value);
        seller.transfer(3*value);
        successful = true;
    }

   function getBalance() view public returns (uint){
       return (address(this).balance);
    }
}