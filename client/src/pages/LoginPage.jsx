import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const demoUsers = [
  {
    label: "Admin demo",
    email: "deepanshupg4@gmail.com",
    password: "Admin@123",
    deviceName: "Admin Laptop",
    deviceFingerprint: "admin-fingerprint-trusted"
  },
  {
    label: "Employee demo",
    email: "employee@zerotrust.local",
    password: "Employee@123",
    deviceName: "Employee Unknown Browser",
    deviceFingerprint: "employee-browser"
  },
  {
    label: "Guest demo",
    email: "guest@zerotrust.local",
    password: "Guest@123",
    deviceName: "Guest Shared PC",
    deviceFingerprint: "guest-shared-device"
  }
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: demoUsers[0].email,
    password: demoUsers[0].password,
    role: "employee",
    deviceName: demoUsers[0].deviceName,
    deviceFingerprint: demoUsers[0].deviceFingerprint
  });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        await register(form);
        setMessage("Registration complete. You can log in now.");
        setMode("login");
        return;
      }

      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-shell">
      <section className="hero-panel">
        <span className="eyebrow">Zero Trust Security Tool</span>
        <h1>Build a gateway that verifies every request.</h1>
        <p>
          This demo evaluates identity, role, device trust, and MFA before allowing
          access to protected resources.
        </p>
        <div className="demo-grid">
          {demoUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              className="demo-card"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  email: user.email,
                  password: user.password,
                  deviceName: user.deviceName,
                  deviceFingerprint: user.deviceFingerprint
                }))
              }
            >
              <strong>{user.label}</strong>
              <span>{user.email}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="form-panel">
        <div className="mode-switch">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full name
              <input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </label>

          {mode === "register" && (
            <label>
              Role
              <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
                <option value="employee">Employee</option>
                <option value="guest">Guest</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          <label>
            Device name
            <input
              value={form.deviceName}
              onChange={(e) => updateField("deviceName", e.target.value)}
            />
          </label>

          <label>
            Device fingerprint
            <input
              value={form.deviceFingerprint}
              onChange={(e) => updateField("deviceFingerprint", e.target.value)}
            />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Working..." : mode === "login" ? "Enter gateway" : "Create user"}
          </button>
        </form>

        {message ? <p className="success-message">{message}</p> : null}
        {error ? <p className="error-message">{error}</p> : null}
      </section>
    </div>
  );
}
