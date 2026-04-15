import { nextId, readData, writeData } from "../db.js";

export function logAccess({
  userId,
  deviceId,
  resource,
  decision,
  reason,
  ipAddress,
  mfaVerified,
  riskLevel
}) {
  const data = readData();
  data.accessLogs.push({
    id: nextId(data, "accessLogs"),
    user_id: userId || null,
    device_id: deviceId || null,
    resource,
    decision,
    reason,
    ip_address: ipAddress || "demo-ip",
    timestamp: new Date().toISOString(),
    mfa_verified: mfaVerified ? 1 : 0,
    risk_level: riskLevel || "low"
  });
  writeData(data);
}

export function getRecentLogs(limit = 20) {
  const data = readData();
  return data.accessLogs
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
    .map((log) => {
      const user = data.users.find((entry) => entry.id === log.user_id);
      const device = data.devices.find((entry) => entry.id === log.device_id);

      return {
        ...log,
        user_name: user?.name,
        user_email: user?.email,
        user_role: user?.role,
        device_name: device?.device_name,
        trust_score: device?.trust_score
      };
    });
}
