/**
 * tgvService
 * Centralises all HTTP calls to the TGV Regularity API.
 */

import axios from 'axios';
import { TGVData, TGVStats } from '../types/tgv.types';

const API_BASE_URL = '/api';

const tgvService = {
  /**
   * Fetches TGV records as a plain array (no pagination wrapper).
   * @param limit - Maximum number of records to retrieve (default 5 000).
   */
  getAllData: async (limit = 5000): Promise<TGVData[]> => {
    const { data } = await axios.get<TGVData[]>(`${API_BASE_URL}/tgv/all?limit=${limit}`);
    return data;
  },

  /**
   * Fetches global statistics (document count, per-region counts,
   * average punctuality, latest record timestamp).
   */
  getStats: async (): Promise<TGVStats> => {
    const { data } = await axios.get<{ stats: TGVStats }>(`${API_BASE_URL}/stats`);
    return data.stats;
  },

  /**
   * Fetches the most-recently inserted records.
   * @param limit - Number of records to retrieve (default 10).
   */
  getLatest: async (limit = 10): Promise<TGVData[]> => {
    const { data } = await axios.get<{ data: TGVData[] }>(`${API_BASE_URL}/latest?limit=${limit}`);
    return data.data;
  },

  /**
   * Fetches records filtered by region name.
   * @param region - Region identifier (e.g. "Atlantique").
   */
  getByRegion: async (region: string): Promise<TGVData[]> => {
    const { data } = await axios.get<{ data: TGVData[] }>(`${API_BASE_URL}/tgv/region/${region}`);
    return data.data;
  },

  /**
   * Fetches the list of distinct region names available in the dataset.
   */
  getRegions: async (): Promise<string[]> => {
    const { data } = await axios.get<{ regions: string[] }>(`${API_BASE_URL}/regions`);
    return data.regions;
  },
};

// Named exports for convenient destructured imports
export const { getAllData, getStats, getLatest, getByRegion, getRegions } = tgvService;

export default tgvService;
