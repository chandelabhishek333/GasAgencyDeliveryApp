/**
 * Formats a rupee amount with Indian digit grouping: 14250 -> "₹14,250",
 * 1234567.5 -> "₹12,34,567.50". Done by hand rather than via
 * toLocaleString('en-IN') so the output doesn't depend on the JS
 * engine's Intl data.
 */
export const formatRupees = (amount: number): string => {
  const [whole, fraction] = Math.abs(amount).toFixed(2).split('.');
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}` : lastThree;
  return `${amount < 0 ? '-' : ''}₹${grouped}${fraction === '00' ? '' : `.${fraction}`}`;
};
