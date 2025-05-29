"use client";

import React from "react";
import Link from "next/link";
import { hasPermission } from "./lib/auth";
import { useAuth } from "./useAuth";
import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", permission: "Dashboard" },
    { name: "Patients", path: "/patient", permission: "Patients" },
    { name: "Appointments", path: "/appointment", permission: "Appointments" },
    { name: "Accounting", path: "/accounting", permission: "Accounting" },
    { name: "ADT", path: "/adt", permission: "ADT" },
    { name: "Billing", path: "/billing", permission: "Billing" },
    { name: "Claim Management", path: "/claim-mgmt", permission: "Claim Management" },
    { name: "Clinical", path: "/clinical", permission: "Clinical" },
    { name: "CSSD", path: "/cssd", permission: "CSSD" },
    { name: "Dispensary", path: "/dispensary", permission: "Dispensary" },
    { name: "Doctor", path: "/doctor", permission: "Doctor" },
    { name: "Emergency", path: "/emergency", permission: "Emergency" },
    { name: "Fixed Assets", path: "/fixed-assets", permission: "Fixed Assets" },
    { name: "Helpdesk", path: "/helpdesk", permission: "Helpdesk" },
    { name: "Incentive", path: "/incentive", permission: "Incentive" },
    { name: "Inventory", path: "/inventory", permission: "Inventory" },
    { name: "Laboratory", path: "/laboratory", permission: "Laboratory" },
    { name: "Maternity", path: "/maternity", permission: "Maternity" },
    { name: "Medical Records", path: "/medical-records", permission: "Medical Records" },
    { name: "Marketing Referral", path: "/mkt-referral", permission: "Marketing Referral" },
    { name: "NHIF", path: "/nhif", permission: "NHIF" },
    { name: "Nursing", path: "/nursing", permission: "Nursing" },
    { name: "Operation Theatre", path: "/operation-theatre", permission: "Operation Theatre" },
    { name: "Pharmacy", path: "/pharmacy", permission: "Pharmacy" },
    { name: "Procurement", path: "/procurement", permission: "Procurement" },
    { name: "Queue Management", path: "/queue-mngmt", permission: "Queue Management" },
    { name: "Radiology", path: "/radiology", permission: "Radiology" },
    { name: "Reports", path: "/reports", permission: "Reports" },
    { name: "Social Service", path: "/social-service", permission: "Social Service" },
    { name: "Substore", path: "/substore", permission: "Substore" },
    { name: "System Admin", path: "/system-admin", permission: "System Admin" },
    { name: "Utilities", path: "/utilities", permission: "Utilities" },
    { name: "Vaccination", path: "/vaccination", permission: "Vaccination" },
  ];


  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <button onClick={toggleSidebar} className={styles.closeButton}>
        ×
      </button>
      <nav className={styles.nav}>
        {menuItems
          .filter(({ permission }) => hasPermission(user.role, permission))
          .map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={styles.navItem}
              onClick={() => toggleSidebar()}
            >
              {name}
            </Link>
          ))}
      </nav>
    </aside>
  );
}