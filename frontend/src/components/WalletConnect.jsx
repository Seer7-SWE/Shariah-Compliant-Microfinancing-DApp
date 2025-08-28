import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";

export default function WalletConnect() {
  const { account, connectWallet } = useContext(Web3Context);
  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <div className="small">Connected account</div>
          <div>{account || "Not connected"}</div>
        </div>
        <div>
          <button onClick={connectWallet}>{account ? "Connected" : "Connect Wallet"}</button>
        </div>
      </div>
    </div>
  );
}
