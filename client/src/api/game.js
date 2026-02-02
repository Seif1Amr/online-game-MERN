import client from './client';

export async function startRound() {
  const res = await client.post('/game/rocket/start');
  return res.data;
}

export async function getRound(id) {
  const res = await client.get(`/game/rocket/round/${id}`);
  return res.data;
}

export async function placeBet(roundId, playerId, amount) {
  const res = await client.post('/game/rocket/bet', { roundId, playerId, amount });
  return res.data;
}

export async function cashout(roundId, playerId) {
  const res = await client.post('/game/rocket/cashout', { roundId, playerId });
  return res.data;
}
