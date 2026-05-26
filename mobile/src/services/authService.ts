import { api } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "VIP";
  isVip: boolean;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function login(email: string, password: string) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function register(name: string, email: string, password: string) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}
