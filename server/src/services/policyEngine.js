import { readData } from "../db.js";

function computeRisk(device, ipAddress) {
  let score = 0;

  if (!device) {
    score += 70;
  } else {
    if (!device.trusted) {
      score += 35;
    }
    if (device.trust_score < 60) {
      score += 25;
    }
  }

  if (!ipAddress || ipAddress === "unknown") {
    score += 10;
  }

  if (score >= 70) {
    return "high";
  }
  if (score >= 35) {
    return "medium";
  }
  return "low";
}

export function evaluateAccess({ user, device, resource, mfaCodeProvided, ipAddress }) {
  const data = readData();
  const matchingPolicies = data.policies
    .filter((policy) => policy.resource === resource)
    .sort((a, b) => a.id - b.id);
  const storedUser = data.users.find((entry) => entry.id === user.id);

  const denyPolicy = matchingPolicies.find(
    (policy) => policy.effect === "deny" && (policy.role_required === user.role || policy.role_required === "any")
  );

  const riskLevel = computeRisk(device, ipAddress);

  if (denyPolicy) {
    return {
      allowed: false,
      reason: `${denyPolicy.name}: access blocked for role ${user.role}.`,
      requiresMfa: false,
      riskLevel
    };
  }

  const allowPolicy = matchingPolicies.find(
    (policy) => policy.effect === "allow" && (policy.role_required === user.role || policy.role_required === "any")
  );

  if (!allowPolicy) {
    return {
      allowed: false,
      reason: "No access policy matched this request.",
      requiresMfa: false,
      riskLevel
    };
  }

  if ((device?.trust_score || 0) < allowPolicy.min_trust_score) {
    return {
      allowed: false,
      reason: `Device trust score is too low for ${resource}.`,
      requiresMfa: false,
      riskLevel
    };
  }

  const needsMfa = Boolean(allowPolicy.requires_mfa) || riskLevel !== "low";
  if (needsMfa && mfaCodeProvided !== storedUser?.current_otp) {
    return {
      allowed: false,
      reason: `Step-up verification required. Use the OTP generated for this login session.`,
      requiresMfa: true,
      riskLevel
    };
  }

  return {
    allowed: true,
    reason: `Access granted to ${resource}.`,
    requiresMfa: false,
    riskLevel
  };
}

export function listPolicies() {
  return readData().policies.slice().sort((a, b) => a.id - b.id);
}
