import axios from 'axios';

const API_URL = 'http://localhost:3001/api/users';

const UserService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  getById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  create: async (user) => {
    // Ensure password field exists as the API requires it
    const userData = {
      ...user,
      password: user.password || `${user.username}123` // Set a default password if not provided
    };
    console.log('Creating user with data:', userData);
    try {
      const res = await axios.post(API_URL, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('User creation successful:', res.data);
      return res.data;
    } catch (error) {
      console.error('User creation error:', error.response?.data || error.message);
      throw error;
    }
  },
  update: async (id, user) => {
    const res = await axios.put(`${API_URL}/${id}`, user);
    return res.data;
  },
  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default UserService;
