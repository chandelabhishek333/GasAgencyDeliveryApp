const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Formats a date as "Tue, 14 Jan 2025" — the Dashboard's date badge. */
export const formatShortDate = (date: Date): string => {
  const weekday = WEEKDAYS[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
};

/**
 * Formats an API delivery date ("2026-09-28", optionally with a time
 * part) as "Mon, 28 Sep 2026". Parsed as a local calendar date rather
 * than via `new Date(iso)`, which reads a bare date as UTC midnight and
 * can land on the previous day west of UTC. Anything unparseable is
 * returned unchanged, so an already-formatted string still displays.
 */
export const formatDeliveryDate = (value: string): string => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return value;
  }
  const [, year, month, day] = match;
  return formatShortDate(new Date(Number(year), Number(month) - 1, Number(day)));
};
