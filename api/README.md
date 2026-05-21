# Corluspor Proxy

Lightweight local proxy that fetches live data from Sofascore and exposes two endpoints used by the static site:

- `GET /api/upcoming` — upcoming matches for the configured team
- `GET /api/standings` — standings for the configured tournament

Usage:

1. Install dependencies:

```bash
cd api
npm install
```

2. Run server:

```bash
npm start
```

3. By default it runs on `http://localhost:3000` and uses environment variables to override IDs:

- `CORLU_TEAM_ID` — team id for Çorluspor on Sofascore
- `TOURNAMENT_ID` — tournament id for the league (default is set to `78424` for 3. Lig 1. Grup)

Example:

```bash
CORLU_TEAM_ID=183823 TOURNAMENT_ID=78424 npm start
```

Then open your site in the browser and it will request `http://localhost:3000/api/standings` and `http://localhost:3000/api/upcoming`.

Notes:
- This proxy solves browser CORS limits by fetching from server-side.
- If Sofascore changes their API, IDs or response shape, the proxy may need small adjustments.
