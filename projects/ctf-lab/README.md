# Multi-level CTF Lab (Proxy + Backend)

This repository provides a multi-level CTF-style lab for demonstrating architectural security issues between a proxy and backend. Levels are implemented in the `proxy` service and the `backend` intentionally keeps weak checks.

## Quick start (Docker)

From the `projects/ctf-lab` directory:

```powershell
docker compose up --build -d
# Open http://localhost:4100
```

- Proxy (frontend + proxy logic) listens on port `4100`.
- Backend listens on port `4200`.

## Level 0 (pass-through)
- Proxy forwards requests to backend without validation.
- Backend stores any incoming payload at `/store` and exposes `/dump` to retrieve stored entries.

Use the web UI at `/` to send raw payloads to `/api/store` and inspect `/api/dump`.

## Next steps
- Implement additional levels by changing the `LEVEL` env var in `docker-compose.yml` and adding logic to `proxy/index.js` for each level.

## Legal
See `legal.md` — all testing must be done locally and ethically.
