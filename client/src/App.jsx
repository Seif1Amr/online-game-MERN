import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AgentDashboard from './pages/agent/Dashboard';
import AgentUsers from './pages/agent/Users';
import AgentCommissions from './pages/agent/Commissions';
import AffiliateDashboard from './pages/affiliate/Dashboard';
import RocketGame from './pages/game/Rocket';
import AgentLayout from './layouts/AgentLayout';
import AffiliateLayout from './layouts/AffiliateLayout';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/agent" element={<AgentLayout><AgentDashboard/></AgentLayout>} />
        <Route path="/agent/users" element={<AgentLayout><AgentUsers/></AgentLayout>} />
        <Route path="/agent/commissions" element={<AgentLayout><AgentCommissions/></AgentLayout>} />
        <Route path="/affiliate" element={<AffiliateLayout><AffiliateDashboard/></AffiliateLayout>} />
        <Route path="/game/rocket" element={<RocketGame/>} />
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </BrowserRouter>
  );
}
