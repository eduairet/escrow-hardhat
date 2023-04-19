// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    bool public isApproved;
    bool public isFinished;

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    event Approved(string);
    event Withdraw(uint indexed Balance);

    function approve() external {
        require(msg.sender == arbiter);
        emit Approved("Approved");
        isApproved = true;
    }

    function withdraw() external {
        require(isApproved, "It's not approved");
        require(msg.sender == beneficiary, "Not the beneficiary");
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Withdraw(balance);
        isFinished = true;
    }
}
