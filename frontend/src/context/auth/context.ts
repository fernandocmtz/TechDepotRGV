import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: Boolean;
  accessToken: string;
  role: string;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;

  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  fetchAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  accessToken: "",
  role: "guest",
  loading: true,
  login: async () => ({ ok: false, message: "" }),
  logout: async () => {},
  register: async () => ({ ok: false, message: "" }),
  fetchAuth: async () => new Response(),
});
