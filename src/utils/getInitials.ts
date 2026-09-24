/** Derives up to 2 initials from a full name, e.g. "Ravi Kumar" -> "RK". */
export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
