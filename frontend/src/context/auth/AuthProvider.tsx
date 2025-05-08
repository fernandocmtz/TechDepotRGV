// src/auth/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from "react";

import { AuthContext } from "./context";

interface AuthProviderProps {
  children: ReactNode;
}

const url = import.meta.env.VITE_API_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [role, setRole] = useState<string>("guest");
  const [loading, setLoading] = useState<boolean>(true);

  // Silent refresh on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${url}/api/auth/refresh_token`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }

        if (data.role) {
          setRole(data.role);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const register = async (username, firstName, lastName, email, password) => {
    const res = await fetch(`${url}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, lastName, email, password }),
    });
    const data = await res.json();
    return { ok: res.ok, message: data.message ?? "" };
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ ok: boolean; message: string }> => {
    const res = await fetch(`${url}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, message: data.message ?? "" };
    setAccessToken(data.accessToken || "");
    setRole(data.role || "guest");
    return { ok: true, message: data.message ?? "" };
  };

  const logout = async (): Promise<void> => {
    await fetch(`${url}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAccessToken("");
    setRole("guest");
  };

  const fetchAuth = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Wait for initial refresh
    if (loading) {
      await new Promise<void>((resolve) => {
        const iv = setInterval(() => {
          if (!loading) {
            clearInterval(iv);
            resolve();
          }
        }, 50);
      });
    }

    const makeCall = () =>
      fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${accessToken}`,
        },
      });

    let res = await makeCall();
    if (res.status === 401) {
      const ref = await fetch(`${url}/api/auth/refresh_token`, {
        method: "POST",
        credentials: "include",
      });
      const data = await ref.json();
      setAccessToken(data.accessToken || "");
      setRole(data.role || "guest");

      res = await makeCall();
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        isAdmin: !!accessToken && role === "admin",
        accessToken,
        role,
        loading,
        login,
        logout,
        register,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
