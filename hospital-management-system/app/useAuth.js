"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getRoleRedirect } from "./lib/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getCurrentUser(token);
          setUser(userData);
          router.push(getRoleRedirect(userData.role));
        } else {
          router.push("/auth");
        }
      } catch (err) {
        console.error("Auth error:", err.message);
        setError(err.message);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const login = async (email, password) => {
    try {
      setError(null);
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
      setError(error.message);
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    try {
      setError(null);
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
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
    router.push("/auth");
  };

  return { user, loading, error, login, register, logout };
};