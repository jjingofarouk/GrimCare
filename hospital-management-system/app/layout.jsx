"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main style={{ marginLeft: isSidebarOpen ? "250px" : "0", transition: "margin-left 0.3s ease-in-out" }}>
          {children}
        </main>
      </body>
    </html>
  );
}