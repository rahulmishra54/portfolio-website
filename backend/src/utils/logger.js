// Simple logger utility for consistent console output across the backend.
// Swap this with a structured logger like Winston or Pino for more advanced setups.

export const info = (message) => {
  console.log(`[INFO] ${message}`);
};

export const error = (message) => {
  console.error(`[ERROR] ${message}`);
};
