import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ role }) {
  return (
    <aside style={{ width: 220, background: '#0f172a', color: '#fff', padding: 20 }}>
      <h3 style={{ color: '#fff' }}>{role === 'agent' ? 'Agent Panel' : 'Affiliate Panel'}</h3>
      <nav style={{ marginTop: 20 }}>
        {role === 'agent' && (
          <>
            <div><Link to="/agent" style={{ color: '#fff' }}>Dashboard</Link></div>
            <div><Link to="/agent/users" style={{ color: '#fff' }}>Users</Link></div>
            <div><Link to="/agent/commissions" style={{ color: '#fff' }}>Commissions</Link></div>
          </>
        )}
        <div style={{ marginTop: 8 }}><Link to="/game/rocket" style={{ color: '#fff' }}>Rocket Game</Link></div>
      </nav>
    </aside>
  );
}
