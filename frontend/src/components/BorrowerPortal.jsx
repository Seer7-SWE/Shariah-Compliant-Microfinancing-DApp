import React, { useContext, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { ethers } from "ethers";

export default function BorrowerPortal() {
  const { account, factoryContract } = useContext(Web3Context);
  const [principal, setPrincipal] = useState("100");
  const [minFund, setMinFund] = useState("50");
  const [tenor, setTenor] = useState("30");
  const [profitShare, setProfitShare] = useState("6000");
  const [markup, setMarkup] = useState("1200");
  const [sector, setSector] = useState("1");
  const [loanType, setLoanType] = useState("0");

  const createLoan = async () => {
    if (!factoryContract) return alert("Connect wallet first");
    // For demo we use a mock stable token address (admin will deploy real stable on network)
    const stableAddress = "0x0000000000000000000000000000000000000000";
    const tx = await factoryContract.createLoan(
      stableAddress,
      ethers.parseUnits(principal, 18),
      ethers.parseUnits(minFund, 18),
      parseInt(tenor),
      parseInt(profitShare),
      parseInt(markup),
      parseInt(sector),
      parseInt(loanType)
    );
    await tx.wait();
    alert("Loan created. Check blockchain for event.");
  };

  return (
    <div>
      <h3>Borrower Portal</h3>
      <div className="column">
        <input value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="Principal (units)" />
        <input value={minFund} onChange={e => setMinFund(e.target.value)} placeholder="Min fund required" />
        <input value={tenor} onChange={e => setTenor(e.target.value)} placeholder="Tenor (days)" />
        <input value={profitShare} onChange={e => setProfitShare(e.target.value)} placeholder="Profit share bps (Mudarabah)" />
        <input value={markup} onChange={e => setMarkup(e.target.value)} placeholder="Markup bps (Murabaha)" />
        <select value={sector} onChange={e => setSector(e.target.value)}>
          <option value="1">General Trade</option>
          <option value="2">Agriculture</option>
        </select>
        <select value={loanType} onChange={e => setLoanType(e.target.value)}>
          <option value="0">Mudarabah (profit-sharing)</option>
          <option value="1">Murabaha (cost-plus)</option>
        </select>
        <button onClick={createLoan}>Create Loan</button>
      </div>
    </div>
  );
}
