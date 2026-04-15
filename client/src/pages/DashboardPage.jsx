import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { MetricCard } from "../components/MetricCard";

const resourceOptions = [
  { value: "admin-dashboard", label: "Admin dashboard" },
  { value: "employee-dashboard", label: "Employee dashboard" },
  { value: "public-portal", label: "Public portal" }
];

export function DashboardPage() {
  const { token, user, device, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [resource, setResource] = useState("admin-dashboard");
  const [mfaCode, setMfaCode] = useState("");
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState("");

  async function loadSummary() {
    try {
      const data = await apiRequest("/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleAccessCheck(event) {
    event.preventDefault();
    setError("");

    try {
      const result = await apiRequest("/dashboard/access-check", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          resource,
          mfaCode,
          deviceId: device?.id
        })
      });

      setDecision(result);
      setMfaCode("");
      loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!summary) {
    return <div className="loading-state">Loading zero trust dashboard...</div>;
  }

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Live security posture</span>
          <h1>ZeroTrust Access Guard</h1>
        </div>
        <div className="topbar-actions">
          <span className="user-badge">
            {user.name} | {user.role}
          </span>
          <button type="button" className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <section className="metric-grid">
        <MetricCard label="Users" value={summary.metrics.totalUsers} accent="#0f766e" />
        <MetricCard label="Devices" value={summary.metrics.totalDevices} accent="#c2410c" />
        <MetricCard label="Allowed" value={summary.metrics.allowCount} accent="#166534" />
        <MetricCard label="Denied" value={summary.metrics.denyCount} accent="#991b1b" />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>Current session</h2>
          <div className="detail-list">
            <p><strong>User:</strong> {user.email}</p>
            <p><strong>Device:</strong> {device?.deviceName}</p>
            <p><strong>Trust score:</strong> {device?.trustScore}</p>
            <p><strong>Trusted:</strong> {device?.trusted ? "Yes" : "No"}</p>
            <p><strong>Current OTP:</strong> {summary.currentOtp || "Generate by logging in again"}</p>
          </div>
        </article>

        <article className="panel">
          <h2>Access request simulator</h2>
          <form className="access-form" onSubmit={handleAccessCheck}>
            <label>
              Resource
              <select value={resource} onChange={(e) => setResource(e.target.value)}>
                {resourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              MFA code
              <input
                placeholder="Enter only if challenged"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
              />
            </label>

            <button className="primary-button" type="submit">
              Evaluate request
            </button>
          </form>

          {decision ? (
            <div className={`decision-card ${decision.allowed ? "allow" : "deny"}`}>
              <strong>{decision.allowed ? "Access allowed" : "Access denied"}</strong>
              <p>{decision.reason}</p>
              <p>Risk level: {decision.riskLevel}</p>
              {decision.requiresMfa ? <p>MFA required before access can continue.</p> : null}
            </div>
          ) : null}

          {error ? <p className="error-message">{error}</p> : null}
        </article>

        <article className="panel">
          <h2>Policy engine</h2>
          <div className="table-list">
            {summary.policies.map((policy) => (
              <div key={policy.id} className="table-row">
                <strong>{policy.name}</strong>
                <span>
                  {policy.effect.toUpperCase()} | {policy.resource} | role {policy.role_required}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel wide">
          <h2>Audit trail</h2>
          <div className="table-list">
            {summary.logs.map((log) => (
              <div key={log.id} className="log-row">
                <div>
                  <strong>{log.user_name || "Unknown user"}</strong>
                  <span>{log.resource} | {log.device_name || "No device"}</span>
                </div>
                <div>
                  <span className={log.decision === "allow" ? "status-allow" : "status-deny"}>
                    {log.decision}
                  </span>
                  <p>{log.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
