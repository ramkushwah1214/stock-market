import axios from 'axios';


export type AuthUser = {
  id: string;
  fullname: string;
  email: string;
  investorType: 'beginner' | 'existing';
  createdAt: string;
};

type AuthResponse = {
  message: string;
  user: AuthUser;
};

axios.defaults.withCredentials = true;

export const authApi = {
  async register(payload: { fullname: string; email: string; password: string; investorType: 'beginner' | 'existing' }) {
    const { data } = await axios.post<AuthResponse>('/api/auth/register', payload);
    return data;
  },

  async login(payload: { email: string; password: string }) {
    const { data } = await axios.post<AuthResponse>('/api/auth/login', payload);
    return data;
  },

  async logout() {
    const { data } = await axios.post<{ message: string }>('/api/auth/logout');
    return data;
  },

  async me() {
    const { data } = await axios.get<{ user: AuthUser }>('/api/auth/me');
    return data;
  },
};
