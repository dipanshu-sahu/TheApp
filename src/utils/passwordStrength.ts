/** Returns a score from 0 (weakest) to 4 (strongest) for a given password. */
export const getPasswordStrength = (password: string): number => {
  if (!password) {
    return 0;
  }

  let score = 0;
  if (password.length >= 8)                             { score += 1; }
  if (/[a-z]/.test(password))                          { score += 1; }
  if (/[A-Z]/.test(password))                          { score += 1; }
  if (/[0-9]/.test(password) || /[#?!@$%^&*-]/.test(password)) { score += 1; }

  return score;
};

/**
 * Splits a full name string into first and last name parts.
 * If only one word is provided, both first and last are set to that word.
 */
export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
};
