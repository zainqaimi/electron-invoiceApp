import React, { useState, useEffect } from "react";

export default function CustomerLedgerView({
  customerId,
}: {
  customerId: number;
}) {
  const [ledger, setLedger] = useState<any[]>([]);

  const fetchLedger = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      "ledger:customer",
      customerId
    );
    setLedger(result);
  };

  useEffect(() => {
    fetchLedger();
  }, [customerId]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Customer Ledger</h2>
      <div className="space-y-2">
        {ledger.map((entry) => (
          <div key={entry.id}>
            <div>{entry.date}</div>
            <div>{entry.note}</div>
            <div>{entry.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
