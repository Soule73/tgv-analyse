# TGV Analyse — Real-Time Punctuality Dashboard

A full-stack, containerised application that simulates and visualises **TGV (French high-speed rail) punctuality data** in real time.

[![Release](https://img.shields.io/github/v/release/Soule73/tgv-analyse)](https://github.com/Soule73/tgv-analyse/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Docker Compose                 │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌─────────────┐ │
│  │ MongoDB  │◄──│   API    │◄──│  Dashboard  │ │
│  │ :27017   │   │ :3000    │   │  :8080      │ │
│  └──────────┘   └──────────┘   └─────────────┘ │
│       ▲                                         │
│  ┌────┴─────┐                                   │
│  │Simulator │                                   │
│  │ (Python) │                                   │
│  └──────────┘                                   │
└─────────────────────────────────────────────────┘
```

| Service | Technology | Port |
|---|---|---|
| **MongoDB** | mongo:latest | 27017 |
| **API** | Node.js / Express | 3000 |
| **Simulator** | Python 3.9 | — |
| **Dashboard** | React + Vite + ECharts | 8080 |

---

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) v2

### Run the stack

```bash
git clone https://github.com/Soule73/tgv-analyse.git
cd tgv-analyse
docker compose up --build -d
```

Then open **http://localhost:8080** in your browser.

### Stop the stack

```bash
docker compose down
```

---

## API endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API discovery |
| GET | `/api/tgv` | All records (paginated) |
| GET | `/api/tgv/all` | All records as array (`?limit=1000`) |
| GET | `/api/tgv/:id` | Single record by ObjectId |
| GET | `/api/tgv/region/:region` | Filter by region |
| GET | `/api/tgv/gare/:gare` | Filter by station |
| GET | `/api/stats` | Global statistics |
| GET | `/api/latest` | Latest records (`?limit=10`) |
| GET | `/api/regions` | List of distinct regions |

---

## Project structure

```
tgv-analyse/
├── docker-compose.yml
├── tgv-api/          # Express REST API
│   └── server.js
├── tgv-data/         # Python data simulator
│   └── tgv_simulator.py
└── tgv-dashboard/    # React + Vite frontend
    └── src/
        ├── components/
        ├── services/
        └── types/
```

---

## Development

### Install root tooling

```bash
npm install
```

### Lint & format

```bash
npm run lint        # ESLint
npm run format      # Prettier
```

### Release a new version

```bash
npm run release:patch   # 1.0.x
npm run release:minor   # 1.x.0
npm run release:major   # x.0.0
git push --follow-tags origin master
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[MIT](LICENSE)
