import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.users || []);
    } catch {
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const downloadCsv = async () => {
    const response = await api.get("/users/export/csv", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="admin-dashboard">
      {/* HERO SECTION */}
      <div className="admin-hero">
        <div className="admin-hero-content">
          <div className="admin-badge">
            <span className="admin-badge-icon">⚡</span>
            Admin Dashboard
          </div>
          <h1>Welcome, {user?.name}</h1>
          <p>Manage users, subscriptions and account status.</p>
        </div>

        <div className="admin-hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{users.length}</span>
            <span className="hero-stat-label">Total Users</span>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="admin-content">
        <div className="admin-card admin-table-card">
          <div className="admin-card-header">
            <h2>Registered Users</h2>

            <div className="header-actions">
              <button
                className="btn-action"
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh
              </button>

              <button className="btn-action btn-export" onClick={downloadCsv}>
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Mobile</th>
                    <th>Company</th>
                    <th>Domain</th>
                    <th>Users</th>
                    <th>Plan</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={10}>
                        <div className="empty-state">
                          <p>No users found.</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {users.map((entry) => (
                    <tr
                      key={entry.id}
                      className={
                        entry.accountStatus === "disabled" ? "row-disabled" : ""
                      }
                    >
                      {/* USER */}
                      <td>
                        <div className="customer-cell">
                          <div className="customer-avatar">
                            {entry.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="customer-info">
                            <span className="customer-name">{entry.name}</span>
                            <span className="customer-email">
                              {entry.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* MOBILE */}
                      <td>{entry.mobile || "-"}</td>

                      {/* COMPANY */}
                      <td>
                        {entry.companyName ? (
                          <div className="company-info">
                            <span>{entry.companyName}</span>
                            <small>{entry.companyAddress || ""}</small>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* DOMAIN */}
                      <td>
                        {entry.domain ? (
                          <span className="domain-text">{entry.domain}</span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* NUMBER OF USERS */}
                      <td>
                        <span className="users-count">
                          {entry.numberOfUsers ?? 1}
                        </span>
                      </td>

                      {/* PLAN */}
                      <td>
                        <span
                          className={`plan-badge ${
                            entry.planType === "pro" ? "plan-pro" : "plan-basic"
                          }`}
                        >
                          {entry.planType || "basic"}
                        </span>
                      </td>

                      {/* DURATION */}
                      <td>
                        <span className="duration-text">
                          {entry.subscriptionDuration || "monthly"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`toggle-label ${
                            entry.accountStatus === "active"
                              ? "active"
                              : "disabled"
                          }`}
                        >
                          {entry.accountStatus}
                        </span>
                      </td>

                      {/* CREATED DATE (FIXED TS ERROR) */}
                      <td>
                        <span className="date-text">
                          {entry.createdAt
                            ? new Date(
                                entry.createdAt as string,
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit">✏️</button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(entry.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="table-footer">
            <span className="results-count">Showing {users.length} users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
