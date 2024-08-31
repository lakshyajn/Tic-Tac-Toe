import axios from 'axios';

export const login = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials);
  const { token } = response.data;
  localStorage.setItem('token', token);
  return token;
};

export const signUp = async (credentials) => {
  const response = await axios.post('/api/auth/sign-up', credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};