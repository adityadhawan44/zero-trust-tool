import { readData } from "../db.js";
import { verifyToken } from "../utils/auth.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authentication token." });
  }

  try {
    const payload = verifyToken(token);
    const data = readData();
    const user = data.users.find((entry) => entry.id === payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = {
      ...user,
      mfaEnabled: Boolean(user.mfa_enabled)
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
