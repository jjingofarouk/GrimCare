"use client";

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flex: 1, marginLeft: isSidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease-in-out" }}>
        <Header toggleSidebar={toggleSidebar} />
        <main style={{ padding: "5rem 1rem 1rem", maxWidth: "1400px", margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}