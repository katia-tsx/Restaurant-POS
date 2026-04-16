
import { create } from 'zustand';

type AuthState = {
  token: string | null;
  username: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('pos_access_token'),
  username: localStorage.getItem('pos_username'),
  setAuth: (token, username) => {
    localStorage.setItem('pos_access_token', token);
    localStorage.setItem('pos_username', username);
    set({ token, username });
  },
  logout: () => {
    localStorage.removeItem('pos_access_token');
    localStorage.removeItem('pos_username');
    set({ token: null, username: null });
  },
}));
