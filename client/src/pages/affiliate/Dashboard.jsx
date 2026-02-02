import React from 'react';

export default function AffiliateDashboard() {
  return (
    <div>
      <h2>Affiliate Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Clicks<br/><strong>120</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Registrations<br/><strong>34</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Revenue<br/><strong>$560</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Wallet<br/><strong>$120</strong></div>
      </div>
    </div>
  );
}
