"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getRoleRedirect } from "./lib/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getTokenFromCookies = () => {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});
    return cookies['token'] || null;
  };

  const setAuthCookie = (token) => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    }
  };

  const clearAuthCookie = () => {
    if (typeof document !== 'undefined') {
      document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
    }
  };

  const checkAuth = useCallback(async () => {
    console.log("Starting checkAuth");
    try {
      const token = getTokenFromCookies();
      console.log("Token retrieved:", token);
      if (token) {
        console.log("Calling getCurrentUser");
        const userData = await getCurrentUser(token);
        console.log("User data retrieved:", userData);
        setUser(userData);
        const redirectPath = getRoleRedirect(userData.role);
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      } else {
        console.log("No token, redirecting to /auth");
        router.push("/auth");
      }
    } catch (err) {
      console.error("checkAuth error:", err.message, err.stack);
      setError(err.message);
      clearAuthCookie();
      setUser(null);
      console.log("Error occurred, redirecting to /auth");
      router.push("/auth");
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    console.log("Running checkAuth effect");
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    console.log("Starting login for:", email);
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      console.log("Login response status:", response.status);
      const data = await response.json();
      if (response.ok) {
        setAuthCookie(data.token);
        console.log("Token saved:", data.token);
        setUser(data.user);
        const redirectPath = getRoleRedirect(data.user.role);
        console.log("Login successful, redirecting to:", redirectPath);
        router.push(redirectPath);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message, error.stack);
      setError(error.message);
      throw error;
    }
  };

  const register = async (email, password, name, role) => {
    console.log("Starting register for:", email);
    try {
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email, password, name, role }),
      });
      console.log("Register response status:", response.status);
      const data = await response.json();
      if (response.ok) {
        setAuthCookie(data.token);
        console.log("Token saved:", data.token);
        setUser(data.user);
        const redirectPath = getRoleRedirect(data.user.role);
        console.log("Register successful, redirecting to:", redirectPath);
        router.push(redirectPath);
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error.message, error.stack);
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out");
    clearAuthCookie();
    setUser(null);
    setError(null);
    router.push("/auth");
  };

  return { user, loading, error, login, register, logout };
};