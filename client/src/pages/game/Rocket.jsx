import React, { useEffect, useRef, useState } from 'react';
import { startRound, getRound, placeBet, cashout } from '../../api/game';

function format(n) {
  return Number(n).toFixed(2);
}

export default function RocketGame() {
  const [roundId, setRoundId] = useState(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [betPlaced, setBetPlaced] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // start a new round when component mounts
    let mounted = true;
    startRound().then((r) => { if (mounted) setRoundId(r.roundId); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!roundId) return;

    let interval = setInterval(async () => {
      const s = await getRound(roundId);
      setMultiplier(s.currentMultiplier || 1.0);
      if (s.crashed) setCrashed(true);
    }, 500);
    return () => clearInterval(interval);
  }, [roundId]);

  async function handlePlaceBet() {
    if (!playerId) return alert('Enter playerId (demo)');
    try {
      await placeBet(roundId, playerId, Number(betAmount));
      setBetPlaced(true);
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  async function handleCashout() {
    try {
      const res = await cashout(roundId, playerId);
      if (res.payout) alert(`Cashed out: $${res.payout} x${res.multiplier}`);
      else if (res.result === 'lost') alert('Too late, round crashed');
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  return (
    <div>
      <h2>Rocket Game (Demo)</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: 300, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
          <div style={{ fontSize: 48, textAlign: 'center' }}>🚀</div>
          <div style={{ textAlign: 'center', fontSize: 32 }}>x{format(multiplier)}</div>
          <div style={{ marginTop: 12 }}>
            <label>PlayerId (demo)</label>
            <input value={playerId} onChange={(e) => setPlayerId(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Bet</label>
            <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handlePlaceBet} disabled={betPlaced || crashed}>Place Bet</button>
            <button onClick={handleCashout} disabled={!betPlaced || crashed}>Cash Out</button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Round</h3>
          <div>Round ID: {roundId}</div>
          <div>Status: {crashed ? 'Crashed' : 'Running'}</div>
          <div style={{ marginTop: 12 }}>
            <h4>History / Info</h4>
            <p>Rounds are generated server-side. This demo polls the server for multiplier updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
