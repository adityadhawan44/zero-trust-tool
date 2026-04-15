import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeDatabase, nextId, readData, resetData, writeData } from "./db.js";
import { hashPassword } from "./utils/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "..", "data");

fs.mkdirSync(dataDir, { recursive: true });

initializeDatabase();
resetData();
const data = readData();

const users = [
  ["Admin User", "deepanshupg4@gmail.com", hashPassword("Admin@123"), "admin", 1],
  ["Employee User", "employee@zerotrust.local", hashPassword("Employee@123"), "employee", 1],
  ["Guest User", "guest@zerotrust.local", hashPassword("Guest@123"), "guest", 0]
];

for (const user of users) {
  data.users.push({
    id: nextId(data, "users"),
    name: user[0],
    email: user[1],
    password_hash: user[2],
    role: user[3],
    mfa_enabled: user[4]
  });
}

const adminId = data.users.find((user) => user.email === "deepanshupg4@gmail.com").id;
const employeeId = data.users.find((user) => user.email === "employee@zerotrust.local").id;
const guestId = data.users.find((user) => user.email === "guest@zerotrust.local").id;

const now = new Date().toISOString();
data.devices.push({
  id: nextId(data, "devices"),
  user_id: adminId,
  device_name: "Admin Laptop",
  fingerprint: "admin-fingerprint-trusted",
  trusted: true,
  trust_score: 88,
  last_seen: now
});
data.devices.push({
  id: nextId(data, "devices"),
  user_id: employeeId,
  device_name: "Employee Unknown Browser",
  fingerprint: "employee-browser",
  trusted: false,
  trust_score: 46,
  last_seen: now
});
data.devices.push({
  id: nextId(data, "devices"),
  user_id: guestId,
  device_name: "Guest Shared PC",
  fingerprint: "guest-shared-device",
  trusted: false,
  trust_score: 30,
  last_seen: now
});

const policies = [
  ["Admin dashboard access", "admin-dashboard", "admin", 70, 1, "allow"],
  ["Employee dashboard access", "employee-dashboard", "employee", 40, 0, "allow"],
  ["Guest public page access", "public-portal", "guest", 20, 0, "allow"],
  ["Block guests from admin page", "admin-dashboard", "guest", 0, 0, "deny"],
  ["Block guests from employee page", "employee-dashboard", "guest", 0, 0, "deny"]
];

for (const policy of policies) {
  data.policies.push({
    id: nextId(data, "policies"),
    name: policy[0],
    resource: policy[1],
    role_required: policy[2],
    min_trust_score: policy[3],
    requires_mfa: policy[4],
    effect: policy[5]
  });
}

writeData(data);

console.log("Seed complete.");
