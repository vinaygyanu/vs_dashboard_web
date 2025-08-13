/**
 * Authentication service for handling user login/logout
 * Using API calls with Axios
 */

import axios from 'axios';

// API base URL - replace with your actual API URL in production
const API_URL = 'http://localhost:3001/api';

// For development/demo purposes, we still keep dummy users
// In a real application, these would be stored securely on the server
const dummyUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', displayName: 'Administrator' },
  { id: 2, username: 'user', password: 'user123', role: 'user', displayName: 'Test User' },
  { id: 3, username: 'demo', password: 'demo123', role: 'demo', displayName: 'Demo Account' }
];

const AuthService = {
  /**
   * Authenticate user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise} Promise that resolves to authentication success status
   */
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const user = response.data;

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          displayName: user.username,
          email: user.email,
          role: 'user',
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        }));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  },
  
  /**
   * Log out current user
   * @returns {Promise} Promise that resolves when logout is complete
   */
  logout: async () => {
    try {
      // In a real app, we would make an API call to invalidate the token on the server
      // For demo purposes, we'll simulate an API call with a timeout
      // await axios.post(`${API_URL}/auth/logout`);
      
      // For demo, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear user data from localStorage
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should clear the local session
      localStorage.removeItem('currentUser');
      return false;
    }
  },
  
  /**
   * Check if a user is currently authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      return false;
    }
    
    try {
      const userObj = JSON.parse(currentUser);
      // Check if user is authenticated and token is not expired
      // In a real app, you would also check token expiry
      return Boolean(userObj.isAuthenticated);
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Get current authenticated user
   * @returns {Promise<Object|null>} Promise that resolves to user data or null if not authenticated
   */
  getCurrentUser: async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!userData) {
        return null;
      }
      
      // In a real app with tokens, you might check if token is still valid here
      // and refresh it if needed
      
      // For demo purposes, if we have a real user ID from the API, fetch latest data
      if (userData.id && !dummyUsers.some(user => user.id === userData.id)) {
        try {
          // Fetch fresh user data for non-dummy users
          const response = await axios.get(`${API_URL}/users/${userData.id}`);
          
          if (response.data) {
            // Update stored user data with the latest from the API
            const updatedUserData = {
              ...userData,
              displayName: response.data.name,
              email: response.data.email,
              phone: response.data.phone,
              website: response.data.website,
              company: response.data.company?.name
            };
            
            // Update local storage with refreshed data
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            
            return updatedUserData;
          }
        } catch (error) {
          console.warn('Failed to refresh user data:', error);
          // If refresh fails, return existing data
        }
      }
      
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  /**
   * Get user profile data by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Promise that resolves to user profile data
   */
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },
  
  /**
   * Update user profile (demo only)
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<boolean>} Promise that resolves to success status
   */
  updateProfile: async (profileData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser || !currentUser.id) {
        return false;
      }
      
      // In a real app, we would send the update to the server
      const response = await axios.patch(`${API_URL}/users/${currentUser.id}`, profileData);
      
      if (response.data) {
        // Update local storage with new profile data
        const updatedUser = {
          ...currentUser,
          ...profileData
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },
  
  /**
   * Check if current user has a specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} Whether user has the required role
   */
  hasRole: (roles) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser || !currentUser.role) {
        return false;
      }
      
      if (Array.isArray(roles)) {
        return roles.includes(currentUser.role);
      }
      
      return currentUser.role === roles;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Sign up a new user
   * @param {string} username - Desired username
   * @param {string} email - User's email address
   * @param {string} password - Desired password
   * @returns {Promise<Object>} Promise that resolves to signup result
   */
  signup: async (username, email, password) => {
    try {
      // Validate required fields
      if (!username || !email || !password) {
        return { success: false, error: 'Username, email, and password are all required' };
      }
      
      // Log the request for debugging
      console.log('Signup request data:', { username, email, password });
      
      // Make API call with proper content type header
      const response = await axios.post(`${API_URL}/users`, {
        username,
        email,
        password,
        status: 'active' // Include status as it's expected by the API
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Signup success:', response.data);
      return { success: true, user: response.data };
    } catch (error) {
      // Log detailed error information for debugging
      console.error('Signup error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      if (error.response?.data?.error) {
        return { success: false, error: error.response.data.error };
      }
      return { success: false, error: 'An error occurred during signup. Please try again.' };
    }
  }
};

export default AuthService;
