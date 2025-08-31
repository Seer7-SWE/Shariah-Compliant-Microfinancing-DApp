// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./utils/PullPayment.sol";
import "./ComplianceRegistry.sol";


contract Loan is PullPayment {
    enum LoanState { PROPOSED, FUNDRAISING, ACTIVE, COMPLETED, DEFAULTED, CANCELLED }
    enum LoanType { MUDARABAH, MURABAHA }

    uint256 public loanId;
    address public borrower;
    IERC20 public stable;
    uint256 public principal;
    uint256 public minFund;
    uint256 public tenorDays;
    uint16 public profitShareBps;
    uint16 public markupBps;
    uint32 public sectorCode;
    LoanType public loanType;

    LoanState public state;
    uint256 public funded;
    uint256 public activatedAt;
    uint256 public repaid;

    mapping(address => uint256) public contributions;
    address[] public investors;

    address public compliance;

    event Funded(address indexed investor, uint256 amount, uint256 fundedTotal);
    event Activated(uint256 at);
    event RepaymentMade(address indexed payer, uint256 amount);
    event WithdrawableAdded(address indexed to, uint256 amount);
    event LoanCancelled();
    event Refund(address indexed investor, uint256 amount);

    modifier onlyBorrower() {
        require(msg.sender == borrower, "Only borrower");
        _;
    }

    modifier onlyWhen(LoanState s) {
        require(state == s, "Invalid state");
        _;
    }

    constructor(
        uint256 _loanId,
        address _borrower,
        address _stable,
        uint256 _principal,
        uint256 _minFund,
        uint256 _tenorDays,
        uint16 _profitShareBps,
        uint16 _markupBps,
        uint32 _sectorCode,
        uint8 _loanType,
        address _compliance
    ) {
        loanId = _loanId;
        borrower = _borrower;
        stable = IERC20(_stable);
        principal = _principal;
        minFund = _minFund;
        tenorDays = _tenorDays;
        profitShareBps = _profitShareBps;
        markupBps = _markupBps;
        sectorCode = _sectorCode;
        loanType = LoanType(_loanType);
        state = LoanState.FUNDRAISING;
        compliance = _compliance;
    }

    function fund(uint256 amount) external onlyWhen(LoanState.FUNDRAISING) {
        require(amount > 0, "Zero");
        uint256 beforeBal = stable.balanceOf(address(this));
        stable.transferFrom(msg.sender, address(this), amount);
        uint256 afterBal = stable.balanceOf(address(this));
        uint256 received = afterBal - beforeBal;
        if (contributions[msg.sender] == 0) investors.push(msg.sender);
        contributions[msg.sender] += received;
        funded += received;
        emit Funded(msg.sender, received, funded);
    }

    function activate() external onlyWhen(LoanState.FUNDRAISING) onlyBorrower {
        ComplianceRegistry reg = ComplianceRegistry(compliance);
        require(reg.loanApproved(loanId), "Not approved by scholar");
        require(funded >= minFund, "Not enough funds");
        state = LoanState.ACTIVE;
        activatedAt = block.timestamp;

        if (loanType == LoanType.MUDARABAH) {
            stable.transfer(borrower, funded);
        } else {
            stable.transfer(borrower, funded);
        }
        emit Activated(activatedAt);
    }

    function repay(uint256 amount) external {
        require(state == LoanState.ACTIVE, "Not active");
        require(amount > 0, "Zero");

        uint256 beforeBal = stable.balanceOf(address(this));
        stable.transferFrom(msg.sender, address(this), amount);
        uint256 afterBal = stable.balanceOf(address(this));
        uint256 received = afterBal - beforeBal;
        repaid += received;
        emit RepaymentMade(msg.sender, received);

        uint256 totalToDistribute = received;
        if (totalToDistribute > 0) {
            for (uint256 i = 0; i < investors.length; i++) {
                address inv = investors[i];
                uint256 share = (contributions[inv] * totalToDistribute) / funded;
                if (share > 0) {
                    _asyncTransfer(inv, share);
                    emit WithdrawableAdded(inv, share);
                }
            }
        }

        if (repaid >= funded + ((funded * markupBps) / 10000)) {
            state = LoanState.COMPLETED;
        }
    }

    function getInvestors() external view returns (address[] memory) {
        return investors;
    }

    function cancelAndRefund() external {
        require(state == LoanState.FUNDRAISING, "Not fundraising");
        require(msg.sender == borrower, "Only borrower");
        state = LoanState.CANCELLED;
        for (uint256 i = 0; i < investors.length; i++) {
            address inv = investors[i];
            uint256 amt = contributions[inv];
            if (amt > 0) {
                contributions[inv] = 0;
                stable.transfer(inv, amt);
                emit Refund(inv, amt);
            }
        }
        emit LoanCancelled();
    }

    function contributionOf(address who) external view returns (uint256) {
        return contributions[who];
    }
}
