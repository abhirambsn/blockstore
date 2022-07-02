//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

contract Escrow {
    address owner;
    uint256 eId;
    uint256 funds;

    enum State {AWAITING_PAYMENT, AWAITING_DELIVERY, DELIVERED, COMPLETED}

    struct EscrowAccount {
        State currentState;
        address payable buyer;
        address payable seller;
        uint256 amount;
    }

    mapping(uint256 => EscrowAccount) public allEscrows;

    modifier onlyOnwer {
        require(msg.sender == owner, "Only Onwer can call the function");
        _;
    }

    event EscrowCreated(uint256 id, address _seller);

    constructor() {
        owner = msg.sender;
        eId = 1;
    }

    function initializeEscrowAccount(address payable _seller, uint256 amount) public payable returns(uint256) {
        require(msg.sender != _seller, "Seller cannot be the buyer");
        require(msg.value == amount, "Insufficient amount");
        EscrowAccount memory ea;
        ea.buyer = payable(msg.sender);
        ea.seller = _seller;
        ea.amount = amount;

        allEscrows[eId++] = ea;
        emit EscrowCreated(eId-1, _seller);
        return eId-1;
    }

    function withdrawFunds(uint256 amount) onlyOnwer public {
        require(amount <= funds, "Amount to withdraw is greater than available Funds");
        payable(owner).transfer(amount);
        funds -= amount;
    }

    function markShipped(uint256 escrowId) public {
        require(msg.sender == allEscrows[escrowId].seller, "Only Seller can mark as Shipped");
        require(allEscrows[escrowId].currentState == State.AWAITING_PAYMENT, "Not in Correct State");
        allEscrows[escrowId].currentState = State.AWAITING_DELIVERY;
    }

    function markDelivered(uint256 escrowId) public {
        require(msg.sender == allEscrows[escrowId].buyer, "Only Buyer can mark as delivered");
        require(allEscrows[escrowId].currentState == State.AWAITING_DELIVERY, "Not in Correct State");
        allEscrows[escrowId].currentState = State.DELIVERED;
    }

    function releaseFunds(uint256 escrowId) public {
        require(msg.sender == allEscrows[escrowId].seller, "Only Seller can release funds");
        require(allEscrows[escrowId].currentState == State.DELIVERED, "Not in Correct State");
        EscrowAccount memory ea = allEscrows[escrowId];
        uint256 amount = ea.amount;
        uint256 escrowFee = (amount*25)/100000; // 0.025%
        uint256 net = amount - escrowFee;
        funds += escrowFee;
        ea.seller.transfer(net);
        allEscrows[escrowId].currentState = State.COMPLETED;
    }

    function refund(uint256 escrowId) public {
        require(((allEscrows[escrowId].currentState == State.DELIVERED) || (allEscrows[escrowId].currentState == State.AWAITING_DELIVERY)), "Not in Correct State");
        require(allEscrows[escrowId].buyer == msg.sender, "Only Buyer can request Refund");
        EscrowAccount memory ea = allEscrows[escrowId];
        uint256 amount = ea.amount;
        uint256 escrowFee = (amount*25)/100000;
        uint256 net = amount - escrowFee;
        ea.buyer.transfer(net);
        funds += escrowFee;
        allEscrows[escrowId].currentState = State.COMPLETED;
    }

    function getEscrowBalance() public view returns(uint256) {
        return funds;
    }
}