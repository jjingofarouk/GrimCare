"use client";

import React, { useState, Suspense } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function RootLayout({ children }) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, lg: isSidebarOpen ? "280px" : "0" },
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        <Suspense fallback={<CircularProgress />}>
          <Box
            component="main"
            sx={{
              padding: { xs: "4rem 0.5rem 1rem", sm: "5rem 1rem 1rem" },
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {children}
          </Box>
        </Suspense>
      </Box>
    </Box>
  );
}