import api from '../utils/api';

const useAuth = () => {
  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  };

  const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  };

  return { login, logout };
};

export default useAuth;
