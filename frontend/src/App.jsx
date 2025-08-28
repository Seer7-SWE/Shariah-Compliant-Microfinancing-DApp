import React from "react";
import WalletConnect from "./components/WalletConnect";
import BorrowerPortal from "./components/BorrowerPortal";
import LenderPortal from "./components/LenderPortal";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div>
      <h1>Shariah-Compliant Microfinance DApp</h1>
      <WalletConnect />
      <div className="flex">
        <div style={{flex:1}}>
          <div className="card"><BorrowerPortal/></div>
          <div className="card"><LenderPortal/></div>
        </div>
        <div style={{width:420}}>
          <div className="card"><Dashboard/></div>
        </div>
      </div>
    </div>
  );
}
