"use client";

import React from "react";
import { UserCircleIcon, BellIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "./useAuth";
import { hasPermission } from "./lib/auth";
import styles from "./Header.module.css";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setProfileOpen] = React.useState(false);

  const dropdownItems = [
    { name: "Profile", path: "/profile", permission: "Profile" },
    { name: "Settings", path: "/settings", permission: "Settings" },
    { name: "Clinical Settings", path: "/clinical-settings", permission: "Clinical Settings" },
    { name: "System Admin", path: "/system-admin", permission: "System Admin" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Bars3Icon className={styles.icon} />
          </button>
          <h1 className={styles.title}>HMS</h1>
        </div>
        <div className={styles.right}>
          <BellIcon className={styles.icon} />
          {user ? (
            <div className={styles.profile}>
              <button
                onClick={() => setProfileOpen(!isProfileOpen)}
                className={styles.profileButton}
              >
                <UserCircleIcon className={styles.icon} />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name || "User"}</span>
                  <span className={styles.userRole}>{user.role}</span>
                </div>
              </button>
              {isProfileOpen && (
                <div className={styles.dropdown}>
                  {dropdownItems
                    .filter(({ permission }) => hasPermission(user.role, permission))
                    .map(({ name, path }) => (
                      <Link
                        key={path}
                        href={path}
                        className={styles.dropdownItem}
                        onClick={() => setProfileOpen(false)}
                      >
                        {name}
                      </Link>
                    ))}
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}