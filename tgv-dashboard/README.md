# TGV Dashboard React

Interactive dashboard to visualize TGV punctuality in France, using React and ECharts.

## Features

- **Key Metrics**: Average punctuality, number of trains, cancellation rate, delays
- **Gauge Chart**: Visualization of overall punctuality
- **Time Evolution**: Punctuality trend over time
- **Regional Analysis**: Performance by region
- **Distribution**: Train distribution by region (Pie chart)
- **Top Routes**: 10 most punctual connections
- **Delay Analysis**: Comparison of delays by region

## Installation

```bash
cd tgv-dashboard
npm install
```

## Start

```bash
npm run dev
```

The dashboard will be available at: **http://localhost:3001**

## Prerequisites

- Node.js 18+
- The TGV API must be running on port 3000
- Docker services (MongoDB, Elasticsearch) must be active

## Technologies Used

- **React 18**: Frontend framework
- **Vite**: Build tool
- **ECharts**: Visualization library
- **Axios**: HTTP client
- **echarts-for-react**: ECharts integration with React

## Architecture

```
src/
├── components/          # Visualization components
│   ├── PonctualiteMetric.jsx
│   ├── PonctualiteEvolution.jsx
│   ├── RegionPerformance.jsx
│   ├── RegionDistribution.jsx
│   ├── TopTrajects.jsx
│   └── RetardsAnalysis.jsx
├── services/           # API services
│   └── tgvService.js
├── App.jsx            # Main component
├── App.css            # Styles
└── main.jsx           # Entry point
```

## API Endpoints Used

- `GET /api/tgv/all`: Retrieve all data
- `GET /api/stats`: Global statistics
- `GET /api/latest`: Latest records

## Production Build

```bash
npm run build
```

Optimized files will be in the `dist/` folder.
