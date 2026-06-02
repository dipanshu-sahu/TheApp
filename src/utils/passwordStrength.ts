export const getPasswordStrength = (password: string): number => {
  if (!password) {
    return 0;
  }

  let score = 0;
  if (password.length >= 8) {
    score += 1;
  }
  if (/[a-z]/.test(password)) {
    score += 1;
  }
  if (/[A-Z]/.test(password)) {
    score += 1;
  }
  if (/[0-9]/.test(password) || /[#?!@$%^&*-]/.test(password)) {
    score += 1;
  }

  return score;
};

export const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
};
