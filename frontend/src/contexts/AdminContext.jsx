import React, { createContext, useContext, useState, useEffect } from "react";
import { adminService } from "@/services/adminService"; // <-- adjust path

//  Create context
const AdminContext = createContext();

//  Provider
export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch Dashboard Stats ---
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await adminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Users ---
  const fetchUsers = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(filters);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD for Users ---
  const createUser = async (userData) => {
    try {
      const newUser = await adminService.updateUser("new", userData); // Replace with real endpoint if exists
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const updatedUser = await adminService.updateUser(id, userData);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
    } catch (err) {
      setError(err.message || "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const suspendUser = async (id) => {
    try {
      await adminService.suspendUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "suspended" } : u))
      );
    } catch (err) {
      setError(err.message || "Failed to suspend user");
    }
  };

  const activateUser = async (id) => {
    try {
      await adminService.activateUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
      );
    } catch (err) {
      setError(err.message || "Failed to activate user");
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
    fetchDashboardStats();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        dashboardStats,
        loading,
        error,
        fetchUsers,
        fetchDashboardStats,
        createUser,
        updateUser,
        deleteUser,
        suspendUser,
        activateUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

//  Custom Hook
export const useAdmin = () => {
  return useContext(AdminContext);
};
