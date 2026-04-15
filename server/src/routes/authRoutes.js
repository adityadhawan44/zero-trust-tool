import express from "express";
import { nextId, readData, writeData } from "../db.js";
import { comparePassword, hashPassword, signToken } from "../utils/auth.js";
import { upsertDevice } from "../services/deviceService.js";

const router = express.Router();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post("/register", (req, res) => {
  const { name, email, password, role = "employee" } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const data = readData();
  const existing = data.users.find((user) => user.email === email);
  if (existing) {
    return res.status(409).json({ message: "A user with that email already exists." });
  }

  const user = {
    id: nextId(data, "users"),
    name,
    email,
    password_hash: hashPassword(password),
    role,
    mfa_enabled: 1
  };
  data.users.push(user);
  writeData(data);

  return res.status(201).json({
    message: "User created successfully.",
    user: {
      ...user,
      mfaEnabled: Boolean(user.mfa_enabled)
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password, deviceName, deviceFingerprint } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const data = readData();
  const user = data.users.find((entry) => entry.email === email);
  if (!user || !comparePassword(password, user.password_hash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  user.current_otp = generateOtp();
  writeData(data);

  const device = upsertDevice(user.id, deviceName, deviceFingerprint);
  const token = signToken(user);

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mfaEnabled: Boolean(user.mfa_enabled)
    },
    currentOtp: user.current_otp,
    device: {
      id: device.id,
      deviceName: device.device_name,
      trustScore: device.trust_score,
      trusted: Boolean(device.trusted)
    }
  });
});

export default router;
