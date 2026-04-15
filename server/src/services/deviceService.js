import { nextId, readData, writeData } from "../db.js";

function scoreFingerprint(fingerprint) {
  if (!fingerprint) {
    return 20;
  }

  const lengthBonus = Math.min(fingerprint.length, 20);
  return 35 + lengthBonus;
}

export function upsertDevice(userId, deviceName, fingerprint) {
  const data = readData();
  const existing = data.devices.find(
    (device) => device.user_id === userId && device.fingerprint === fingerprint
  );

  const lastSeen = new Date().toISOString();

  if (existing) {
    existing.last_seen = lastSeen;
    writeData(data);
    return { ...existing, trusted: Boolean(existing.trusted) };
  }

  const trustScore = scoreFingerprint(fingerprint);
  const device = {
    id: nextId(data, "devices"),
    user_id: userId,
    device_name: deviceName || "Unknown Device",
    fingerprint: fingerprint || "unknown",
    trusted: trustScore >= 60,
    trust_score: trustScore,
    last_seen: lastSeen
  };

  data.devices.push(device);
  writeData(data);
  return device;
}

export function listDevicesForUser(userId) {
  const data = readData();
  return data.devices
    .filter((device) => device.user_id === userId)
    .sort((a, b) => b.last_seen.localeCompare(a.last_seen))
    .map((device) => ({
      ...device,
      trusted: Boolean(device.trusted)
    }));
}
