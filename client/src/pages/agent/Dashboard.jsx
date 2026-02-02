import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgentDashboard() {
  const [data] = useState([
    { name: 'Day 1', earnings: 50 },
    { name: 'Day 2', earnings: 120 },
    { name: 'Day 3', earnings: 80 },
    { name: 'Day 4', earnings: 200 },
    { name: 'Day 5', earnings: 160 },
    { name: 'Day 6', earnings: 220 },
    { name: 'Day 7', earnings: 180 },
  ]);

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Total Players<br/><strong>5</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Revenue<br/><strong>$1,234</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Pending<br/><strong>$120</strong></div>
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>Wallet<br/><strong>$300</strong></div>
      </div>

      <div style={{ marginTop: 20, height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
