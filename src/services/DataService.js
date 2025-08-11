/**
 * Data service for fetching dashboard data
 * Currently uses local db.json file but can be replaced with actual API calls
 */

import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

/**
 * Service to retrieve dashboard data
 * This can be replaced with actual API calls in the future
 */
export const DataService = {
  /**
   * Get all dashboard data
   * @returns {Promise} Promise that resolves to the entire dashboard data
   */
  getAllData: async () => {
    // Optionally, fetch all relevant data in parallel
    const [summary, usage, activity, anomalies, systemStatus] = await Promise.all([
      axios.get(`${API_URL}/summary`),
      axios.get(`${API_URL}/usage`),
      axios.get(`${API_URL}/user-activity`),
      axios.get(`${API_URL}/anomalies`),
      axios.get(`${API_URL}/system-status`)
    ]);
    return {
      summary: summary.data,
      usage: usage.data,
      activity: activity.data,
      anomalies: anomalies.data,
      systemStatus: systemStatus.data
    };
  },

  /**
   * Get summary card data
   * @returns {Promise} Promise that resolves to summary card data
   */
  getSummaryData: async () => {
    const res = await axios.get(`${API_URL}/summary`);
    return res.data;
  },

  /**
   * Get usage metrics data
   * @param {string} timeframe - 'daily' or 'monthly'
   * @returns {Promise} Promise that resolves to usage metrics data
   */
  getUsageData: async (timeframe = 'daily') => {
    const res = await axios.get(`${API_URL}/usage?timeframe=${timeframe}`);
    return res.data;
  },

  /**
   * Get user activity data
   * @returns {Promise} Promise that resolves to user activity data
   */
  getUserActivity: async () => {
    const res = await axios.get(`${API_URL}/user-activity`);
    return res.data;
  },

  /**
   * Get anomalies data
   * @returns {Promise} Promise that resolves to anomalies data
   */
  getAnomalies: async () => {
    const res = await axios.get(`${API_URL}/anomalies`);
    return res.data;
  },

  /**
   * Get system status data
   * @returns {Promise} Promise that resolves to system status data
   */
  getSystemStatus: async () => {
    const res = await axios.get(`${API_URL}/system-status`);
    return res.data;
  }
};

export default DataService;
