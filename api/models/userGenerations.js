import { readFileSync } from "fs";
import { join } from "path";

// In-memory storage for user generations (replace with a proper database in production)
let userGenerations = new Map();

// Read user limits configuration
const userLimits = JSON.parse(
  readFileSync(join(process.cwd(), "api/config/userLimits.json"), "utf8")
);

export function getUserGenerationsCount(userId, email) {
  return userGenerations.get(userId) || 0;
}

export function incrementUserGenerations(userId) {
  const currentCount = getUserGenerationsCount(userId);
  userGenerations.set(userId, currentCount + 1);
  return currentCount + 1;
}

export function getUserLimit(email) {
  // Check if user has a special limit
  if (email && userLimits.specialUsers[email]) {
    return userLimits.specialUsers[email];
  }
  // Return default limit
  return userLimits.defaultLimit;
}

export function canUserGenerate(userId, email) {
  const currentCount = getUserGenerationsCount(userId);
  const userLimit = getUserLimit(email);

  // If userLimit is -1, user has unlimited generations
  if (userLimit === -1) return true;

  return currentCount < userLimit;
}

// For development/testing: reset all counts
export function resetGenerationCounts() {
  userGenerations.clear();
}
