import { createContext } from "react";

export interface AuthContextType {
  accessToken: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: "",
  loading: true,
  login: async () => false,
  logout: async () => {},
  fetchAuth: async () => new Response(),
});
