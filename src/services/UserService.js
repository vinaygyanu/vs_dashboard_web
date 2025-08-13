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
    const res = await axios.post(API_URL, user);
    return res.data;
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
