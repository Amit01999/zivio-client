import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { SafeUser, AuthTokens } from "@/types/schema";
import { apiRequest } from "./queryClient";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; confirmPassword: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to decode JWT and check expiry
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    // Consider token expired if it expires within next 5 minutes
    return expiryTime - now < 5 * 60 * 1000;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}

// Helper to refresh access token using refresh token
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return null;
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      return data.accessToken;
    } else {
      // Refresh token is invalid or expired
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check if token is expired or about to expire
      if (isTokenExpired(token)) {
        console.log("Access token expired, attempting to refresh...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          // Failed to refresh, user needs to login again
          setUser(null);
          setIsLoading(false);
          return;
        }
        token = newToken;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        // Token is invalid, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const retryResponse = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            setUser(data.user);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up automatic token refresh check every 5 minutes
  useEffect(() => {
    if (user && !refreshIntervalRef.current) {
      refreshIntervalRef.current = setInterval(() => {
        const token = localStorage.getItem("accessToken");
        if (token && isTokenExpired(token)) {
          console.log("Token expiring soon, refreshing...");
          refreshUser();
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, refreshUser]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = response as { user: SafeUser; tokens: AuthTokens };

    localStorage.setItem("accessToken", data.tokens.accessToken);
    localStorage.setItem("refreshToken", data.tokens.refreshToken);
    setUser(data.user);

    return data.user;
  };

  const register = async (data: { name: string; email: string; password: string; confirmPassword: string; phone?: string; role?: string }) => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    const result = response as { user: SafeUser; tokens: AuthTokens };

    localStorage.setItem("accessToken", result.tokens.accessToken);
    localStorage.setItem("refreshToken", result.tokens.refreshToken);
    setUser(result.user);

    return result.user;
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
    } catch (error) {
      // Ignore errors on logout
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);

    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}