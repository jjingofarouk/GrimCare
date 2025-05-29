import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getRoleRedirect } from "../lib/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          setUser(userData);
          // Redirect to role-specific page after authentication
          router.push(getRoleRedirect(userData.role));
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
          router.push("/auth");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push(getRoleRedirect(data.user.role));
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const register = async (email, password, name, role) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email, password, name, role }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push(getRoleRedirect(data.user.role));
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth");
  };

  return { user, loading, login, register, logout };
};