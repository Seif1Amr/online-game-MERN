import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AgentLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role="agent" />
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
