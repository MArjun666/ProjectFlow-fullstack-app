import api from './api';

const login = async (email, password) => {
  // Use 'api' instance instead of 'axios' to ensure /api prefix and proxy are used
  const response = await api.post('/auth/login', { email, password });
  if (response.data && response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (name, email, password, role, avatar) => {
  const response = await api.post('/auth/register', { name, email, password, role, avatar });
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

const authService = { register, login, logout, getMe };
export default authService;