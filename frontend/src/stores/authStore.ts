
import { create } from 'zustand';
import { roleFromToken } from '../lib/jwt';

const TOKEN_KEY = 'pos_access_token';
const USER_KEY = 'pos_username';
const ROLE_KEY = 'pos_role';

type AuthState = {
  token: string | null;
  username: string | null;
  role: string | null;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
  hydrateRole: () => void;
};

function persistRole(token: string | null) {
  const r = roleFromToken(token);
  if (r) localStorage.setItem(ROLE_KEY, r);
  else localStorage.removeItem(ROLE_KEY);
  return r;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  username: localStorage.getItem(USER_KEY),
  role: localStorage.getItem(ROLE_KEY) || roleFromToken(localStorage.getItem(TOKEN_KEY)),

  setAuth: (token, username) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username);
    const role = persistRole(token);
    set({ token, username, role });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    set({ token: null, username: null, role: null });
  },

  hydrateRole: () => {
    const token = get().token ?? localStorage.getItem(TOKEN_KEY);
    const role = persistRole(token);
    set({ role });
  },
}));
