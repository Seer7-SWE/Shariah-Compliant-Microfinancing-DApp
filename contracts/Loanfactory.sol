// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Loan.sol";
import "./ComplianceRegistry.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LoanFactory is AccessControl {
    address[] public loans;
    ComplianceRegistry public compliance;

    event LoanCreated(address indexed loan, address indexed borrower, uint256 indexed loanId);

    uint256 public nextLoanId;

    constructor(address _compliance) {
        compliance = ComplianceRegistry(_compliance);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createLoan(
        address stableAsset,
        uint256 principal,
        uint256 minFund,
        uint256 tenorDays,
        uint16 profitShareBps,
        uint16 markupBps,
        uint32 sectorCode,
        uint8 loanType // 0: MUDARABAH, 1: MURABAHA
    ) external returns (address) {
        require(compliance.sectorAllowed(sectorCode), "Sector not allowed");
        uint256 loanId = ++nextLoanId;
        Loan newLoan = new Loan(
            loanId,
            msg.sender,
            stableAsset,
            principal,
            minFund,
            tenorDays,
            profitShareBps,
            markupBps,
            sectorCode,
            loanType,
            address(compliance)
        );
        loans.push(address(newLoan));
        emit LoanCreated(address(newLoan), msg.sender, loanId);
        return address(newLoan);
    }

    function getLoans() external view returns (address[] memory) {
        return loans;
    }
}
