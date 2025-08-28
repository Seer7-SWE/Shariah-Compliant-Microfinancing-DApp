import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "../context/Web3Context";

export default function LenderPortal() {
  const { factoryContract } = useContext(Web3Context);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    async function load() {
      if (!factoryContract) return;
      try {
        const addresses = await factoryContract.getLoans();
        setLoans(addresses);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [factoryContract]);

  return (
    <div>
      <h3>Lender Portal</h3>
      <div>
        {loans.length === 0 && <div className="small">No loans yet</div>}
        {loans.map((l, i) => (
          <div key={i} className="card">
            <LoanCard address={l} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoanCard({ address }) {
  const { provider, account } = useContext(Web3Context);
  const [info, setInfo] = useState(null);
  const [amount, setAmount] = useState("10");

  useEffect(() => {
    async function fetchInfo() {
      if (!provider) return;
      const abi = [
        "function funded() view returns (uint256)",
        "function principal() view returns (uint256)",
        "function contributionOf(address) view returns (uint256)",
        "function fund(uint256) external"
      ];
      try {
        const signerOrProvider = provider;
        const contract = new (await import("ethers")).ethers.Contract(address, abi, signerOrProvider);
        const funded = await contract.funded();
        const principal = await contract.principal();
        setInfo({ funded: funded.toString(), principal: principal.toString() });
      } catch (e) { console.error(e); }
    }
    fetchInfo();
  }, [address, provider]);

  const fund = async () => {
    if (!provider) return alert("Connect wallet");
    const signer = await provider.getSigner();
    const abi = ["function fund(uint256)"];
    const contract = new (await import("ethers")).ethers.Contract(address, abi, signer);
    // NOTE: In this demo we assume ERC20 token and transferFrom; user must approve beforehand.
    try {
      const tx = await contract.fund((BigInt(amount) * (10n ** 18n)).toString());
      await tx.wait();
      alert("Funded");
    } catch (e) {
      console.error(e);
      alert("Failed to fund: check token approvals & network");
    }
  };

  return (
    <div>
      <div className="small">Loan: {address}</div>
      <div className="small">Funded: {info ? info.funded : "..."}</div>
      <div className="small">Principal: {info ? info.principal : "..."}</div>
      <div style={{marginTop:8}}>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button onClick={fund}>Fund</button>
      </div>
    </div>
  );
}
