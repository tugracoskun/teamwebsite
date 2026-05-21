const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Configure these IDs if needed
const CORLU_TEAM_ID = process.env.CORLU_TEAM_ID || 183823; // Çorluspor Sofascore ID (may need update)
const TOURNAMENT_ID = process.env.TOURNAMENT_ID || 78424; // 3. Lig 1. Grup ID

// Simple in-memory cache
let cache = {
  upcoming: { ts: 0, data: null },
  standings: { ts: 0, data: null }
};
const CACHE_TTL = 60 * 1000; // 60 seconds default cache TTL

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

async function fetchSofascoreUpcoming() {
  const url = `https://www.sofascore.com/api/v1/team/${CORLU_TEAM_ID}/events?status=unplayed`;
  const r = await fetch(url, { timeout: 10000 });
  const json = await r.json();
  if (!json.events) return [];

  // map to our minimal format
  return json.events.map(e => {
    const start = e.startTimestamp ? new Date(e.startTimestamp * 1000) : null;
    const date = start ? start.toISOString().slice(0,10) : null;
    const time = start ? `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}` : null;

    return {
      home: {
        name: e.homeTeam && e.homeTeam.name ? e.homeTeam.name : (e.homeTeam && e.homeTeam.shortName) || 'Ev Sahibi',
        logo: e.homeTeam && e.homeTeam.logo ? e.homeTeam.logo : null
      },
      away: {
        name: e.awayTeam && e.awayTeam.name ? e.awayTeam.name : (e.awayTeam && e.awayTeam.shortName) || 'Konuk',
        logo: e.awayTeam && e.awayTeam.logo ? e.awayTeam.logo : null
      },
      date,
      time
    };
  });
}

async function fetchSofascoreStandings() {
  const url = `https://www.sofascore.com/api/v1/uniqueTournament/${TOURNAMENT_ID}/standings`;
  const r = await fetch(url, { timeout: 10000 });
  const json = await r.json();
  if (!json.standings || !json.standings[0] || !json.standings[0].rows) return [];

  return json.standings[0].rows.map((row, idx) => ({
    position: row.position || (idx + 1),
    name: row.team && row.team.name ? row.team.name : (row.team && row.team.shortName) || 'Takım',
    logo: row.team && row.team.logo ? row.team.logo : null,
    played: row.playedGames || row.matches || 0,
    goalDiff: (row.goalsDiff !== undefined) ? (row.goalsDiff >= 0 ? `+${row.goalsDiff}` : String(row.goalsDiff)) : '0',
    points: row.points || 0
  }));
}

app.get('/api/upcoming', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.upcoming.data && (now - cache.upcoming.ts) < CACHE_TTL) {
      return res.json({ source: 'cache', upcoming: cache.upcoming.data });
    }

    const data = await fetchSofascoreUpcoming();
    cache.upcoming = { ts: Date.now(), data };
    res.json({ source: 'sofascore', upcoming: data });
  } catch (err) {
    console.error('upcoming error', err);
    res.status(500).json({ error: 'failed to fetch upcoming' });
  }
});

app.get('/api/standings', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.standings.data && (now - cache.standings.ts) < CACHE_TTL) {
      return res.json({ source: 'cache', standings: cache.standings.data });
    }

    const data = await fetchSofascoreStandings();
    cache.standings = { ts: Date.now(), data };
    res.json({ source: 'sofascore', standings: data });
  } catch (err) {
    console.error('standings error', err);
    res.status(500).json({ error: 'failed to fetch standings' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
  console.log(`CORLU_TEAM_ID=${CORLU_TEAM_ID}, TOURNAMENT_ID=${TOURNAMENT_ID}`);
});
