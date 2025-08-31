// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Minimal PullPayment base contract.
 * Stores balances for payees and lets them withdraw later.
 */
abstract contract PullPayment {
    mapping(address => uint256) private _payments;

    event PaymentDeposited(address indexed payee, uint256 amount);
    event PaymentWithdrawn(address indexed payee, uint256 amount);

    function payments(address payee) public view returns (uint256) {
        return _payments[payee];
    }

    function _asyncTransfer(address payee, uint256 amount) internal virtual {
        require(payee != address(0), "Invalid payee");
        _payments[payee] += amount;
        emit PaymentDeposited(payee, amount);
    }

    function _withdrawPayment(address payable payee) internal virtual {
        uint256 payment = _payments[payee];
        require(payment > 0, "No payments due");

        _payments[payee] = 0;

        (bool success, ) = payee.call{value: payment}("");
        require(success, "Withdraw failed");

        emit PaymentWithdrawn(payee, payment);
    }
}
