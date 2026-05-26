import { create } from "zustand";
import type { AuthUser } from "../services/authService";

type AuthState = {
  token?: string;
  user?: AuthUser;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setSession: (token, user) => set({ token, user }),
  logout: () => set({ token: undefined, user: undefined })
}));
