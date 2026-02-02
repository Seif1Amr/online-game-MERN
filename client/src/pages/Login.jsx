import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('agent');
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    // very simple: redirect to role dashboard
    if (role === 'agent') navigate('/agent');
    else navigate('/affiliate');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={submit} style={{ width: 380, padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Sign in (demo)</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="agent">Agent</option>
            <option value="affiliate">Affiliate</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
}
