/**
 * Data service for fetching dashboard data
 * Currently uses local db.json file but can be replaced with actual API calls
 */

// Import the JSON data directly
import dashboardData from '../assets/data/db.json';

/**
 * Service to retrieve dashboard data
 * This can be replaced with actual API calls in the future
 */
export const DataService = {
  /**
   * Get all dashboard data
   * @returns {Promise} Promise that resolves to the entire dashboard data
   */
  getAllData: () => {
    return new Promise((resolve) => {
      // Simulate network delay for realistic behavior
      setTimeout(() => {
        resolve(dashboardData);
      }, 300);
    });
  },

  /**
   * Get summary card data
   * @returns {Promise} Promise that resolves to summary card data
   */
  getSummaryData: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.summaryCards);
      }, 300);
    });
  },

  /**
   * Get usage metrics data
   * @param {string} timeframe - 'daily' or 'monthly'
   * @returns {Promise} Promise that resolves to usage metrics data
   */
  getUsageData: (timeframe = 'daily') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.usageMetrics[timeframe]);
      }, 300);
    });
  },

  /**
   * Get user activity data
   * @returns {Promise} Promise that resolves to user activity data
   */
  getUserActivity: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.userActivity);
      }, 300);
    });
  },

  /**
   * Get anomalies data
   * @returns {Promise} Promise that resolves to anomalies data
   */
  getAnomalies: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.anomalies);
      }, 300);
    });
  },

  /**
   * Get top pages data
   * @returns {Promise} Promise that resolves to top pages data
   */
  getTopPages: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.topPages);
      }, 300);
    });
  },

  /**
   * Get system status data
   * @returns {Promise} Promise that resolves to system status data
   */
  getSystemStatus: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dashboardData.systemStatus);
      }, 300);
    });
  }
};

export default DataService;
