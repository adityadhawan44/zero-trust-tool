import express from "express";
import { readData } from "../db.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getRecentLogs, logAccess } from "../services/auditService.js";
import { listDevicesForUser } from "../services/deviceService.js";
import { evaluateAccess, listPolicies } from "../services/policyEngine.js";

const router = express.Router();

router.use(requireAuth);

router.get("/summary", (req, res) => {
  const data = readData();
  const totalUsers = data.users.length;
  const totalDevices = data.devices.length;
  const allowCount = data.accessLogs.filter((log) => log.decision === "allow").length;
  const denyCount = data.accessLogs.filter((log) => log.decision === "deny").length;

  return res.json({
    user: req.user,
    currentOtp: data.users.find((entry) => entry.id === req.user.id)?.current_otp || null,
    metrics: {
      totalUsers,
      totalDevices,
      allowCount,
      denyCount
    },
    policies: listPolicies(),
    devices: listDevicesForUser(req.user.id),
    logs: getRecentLogs(12)
  });
});

router.post("/access-check", (req, res) => {
  const { resource, mfaCode, deviceId } = req.body;

  if (!resource) {
    return res.status(400).json({ message: "Resource is required." });
  }

  const data = readData();
  const device = deviceId
    ? data.devices.find((entry) => entry.id === deviceId && entry.user_id === req.user.id)
    : data.devices
        .filter((entry) => entry.user_id === req.user.id)
        .sort((a, b) => b.last_seen.localeCompare(a.last_seen))[0];

  const result = evaluateAccess({
    user: req.user,
    device,
    resource,
    mfaCodeProvided: mfaCode,
    ipAddress: req.ip
  });

  logAccess({
    userId: req.user.id,
    deviceId: device?.id,
    resource,
    decision: result.allowed ? "allow" : "deny",
    reason: result.reason,
    ipAddress: req.ip,
    mfaVerified: Boolean(mfaCode),
    riskLevel: result.riskLevel
  });

  return res.json({
    ...result,
    device: device
      ? {
          id: device.id,
          deviceName: device.device_name,
          trustScore: device.trust_score,
          trusted: Boolean(device.trusted)
        }
      : null
  });
});

router.get("/logs", (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can view all logs." });
  }

  return res.json({ logs: getRecentLogs(50) });
});

export default router;
