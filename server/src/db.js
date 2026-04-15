import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "..", "data");
const dbPath = path.join(dataDir, "zerotrust.json");

const defaultData = {
  counters: {
    users: 0,
    devices: 0,
    policies: 0,
    accessLogs: 0
  },
  users: [],
  devices: [],
  policies: [],
  accessLogs: []
};

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(defaultData));
}

function ensureStorage() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
}

export function readData() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

export function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function initializeDatabase() {
  ensureStorage();
}

export function resetData() {
  writeData(cloneDefaultData());
}

export function nextId(data, tableName) {
  data.counters[tableName] += 1;
  return data.counters[tableName];
}
