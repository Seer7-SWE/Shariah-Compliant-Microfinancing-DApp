// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ComplianceRegistry is AccessControl {
    bytes32 public constant SCHOLAR_ROLE = keccak256("SCHOLAR_ROLE");

    mapping(uint32 => bool) public sectorAllowed;
    mapping(address => bool) public vendorAllowed;

    // loanId => approved
    mapping(uint256 => bool) public loanApproved;
    // loanId => note CID (off-chain)
    mapping(uint256 => string) public scholarNoteCID;

    event SectorUpdated(uint32 indexed sector, bool allowed);
    event VendorUpdated(address indexed vendor, bool allowed);
    event LoanVerified(uint256 indexed loanId, address indexed scholar, bool approved, string noteCID);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(SCHOLAR_ROLE, admin);
    }

    function setSector(uint32 code, bool ok) external onlyRole(DEFAULT_ADMIN_ROLE) {
        sectorAllowed[code] = ok;
        emit SectorUpdated(code, ok);
    }

    function setVendor(address vendor, bool ok) external onlyRole(DEFAULT_ADMIN_ROLE) {
        vendorAllowed[vendor] = ok;
        emit VendorUpdated(vendor, ok);
    }

    function verifyLoan(uint256 loanId, bool approved, string calldata noteCID)
        external onlyRole(SCHOLAR_ROLE)
    {
        loanApproved[loanId] = approved;
        scholarNoteCID[loanId] = noteCID;
        emit LoanVerified(loanId, msg.sender, approved, noteCID);
    }
}
