import { createContext } from "react";

export interface AuthContextType {
  accessToken: string;
  loading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  fetchAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: "",
  loading: true,
  login: async () => ({ ok: false, message: "" }),
  logout: async () => {},
  fetchAuth: async () => new Response(),
});
