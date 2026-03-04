/**
 * App
 * Root component for the TGV Real-Time Dashboard.
 * Fetches data on mount, then refreshes every 30 seconds in the background.
 */

import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getAllData, getStats } from './services/tgvService';
import type { TGVData, TGVStats } from './types/tgv.types';
import PonctualiteMetric from './components/PonctualiteMetric';
import PonctualiteEvolution from './components/PonctualiteEvolution';
import RegionPerformance from './components/RegionPerformance';
import RegionDistribution from './components/RegionDistribution';
import TopTrajets from './components/TopTrajects';
import RetardsAnalysis from './components/RetardsAnalysis';

const REFRESH_INTERVAL_MS = 30_000;
const DATA_FETCH_LIMIT = 500;

function App() {
  const [data, setData] = useState<TGVData[]>([]);
  const [stats, setStats] = useState<TGVStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Loads TGV data and global stats in parallel.
   * @param showLoader - When true, shows the full-screen spinner during the fetch.
   */
  const loadData = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setError(null);

    try {
      const [tgvData, tgvStats] = await Promise.all([getAllData(DATA_FETCH_LIMIT), getStats()]);

      setData(tgvData);
      setStats(tgvStats);
      setIsInitialLoad(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Data fetch error:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Initial fetch + background refresh every 30 seconds
  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => loadData(false), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading && isInitialLoad) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Chargement des données TGV...</p>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => loadData(true)} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  // ── Derived metrics ───────────────────────────────────────────────────────
  const totalTrains = data.reduce((sum, item) => sum + item.trains_prevus, 0);
  const totalRetards = data.reduce((sum, item) => sum + item.retards, 0);
  const avgPonctualite = stats?.ponctualite_moyenne?.toFixed(2) ?? '0';
  const updatedAt = new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <h1>Dashboard TGV</h1>
          <span className="header-info">Mis à jour: {updatedAt}</span>
        </div>
        <button onClick={() => loadData(false)} className="refresh-button">
          Actualiser
        </button>
      </header>

      <main className="dashboard-container">
        {/* ── Summary metrics ── */}
        <div className="metrics-grid">
          <div className="stat-item">
            <span className="stat-label">Documents:</span>
            <span className="stat-value">{stats?.total_documents ?? 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Trains prévus:</span>
            <span className="stat-value">{totalTrains}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Retards totaux:</span>
            <span className="stat-value">{totalRetards}</span>
          </div>
        </div>

        {/* ── Chart grid ── */}
        <div className="dashboard-grid">
          <div className="chart-card">
            <PonctualiteMetric avgPonctualite={parseFloat(avgPonctualite)} />
          </div>
          <div className="chart-card">
            <PonctualiteEvolution data={data} />
          </div>
          <div className="chart-card">
            <RegionPerformance data={data} />
          </div>
          <div className="chart-card">
            <RegionDistribution data={data} />
          </div>
          <div className="chart-card">
            <TopTrajets data={data} />
          </div>
          <div className="chart-card">
            <RetardsAnalysis data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
