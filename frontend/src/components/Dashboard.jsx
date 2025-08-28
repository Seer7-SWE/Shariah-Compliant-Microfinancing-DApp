import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h3>Analytics Dashboard</h3>
      <div className="small">Summary metrics will be shown here (use backend to index events & serve aggregated stats)</div>
      <div style={{marginTop:8}}>
        <div className="card small">Total Loans: —</div>
        <div className="card small">Total Funded: —</div>
        <div className="card small">Repayment Rate: —</div>
      </div>
    </div>
  );
}
