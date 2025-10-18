import axios from 'axios';
import api from './api';

const AUTH_API_URL = '/api/auth'; // Use relative URL

const login = async (email, password) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });
  if (response.data && response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (name, email, password, role, avatar) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, { name, email, password, role, avatar });
   if (response.data && response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getMe = () => {
  return api.get('/auth/me');
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;