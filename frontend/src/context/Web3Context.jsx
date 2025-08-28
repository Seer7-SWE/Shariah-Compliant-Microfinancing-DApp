import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContractData } from "../utils/contracts";

export const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [complianceContract, setComplianceContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
    }
  }, []);

  async function connectWallet() {
    if (!provider) throw new Error("No provider");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAccount(addr);

    // load contracts from contracts.json (injected by deploy script)
    const factoryData = getContractData("LoanFactory");
    const compData = getContractData("ComplianceRegistry");
    
    const compliance = new ethers.Contract(compData.address, compData.abi, signer);

    setFactoryContract(factory);
    setComplianceContract(compliance);

    const factory = new ethers.Contract(
       "0xPUsqB-NMpMw13juXkSmpD",
      loanFactoryABI,
       signer
);

  }

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      factoryContract,
      complianceContract,
      connectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
}
