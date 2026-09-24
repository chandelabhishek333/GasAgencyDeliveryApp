/**
 * Time-of-day greeting. The reference mockup hardcodes "Good Morning,"
 * as its demo state; a real dashboard should reflect the actual time.
 */
export const getGreeting = (hour: number = new Date().getHours()): string => {
  if (hour < 12) {
    return 'Good Morning,';
  }
  if (hour < 17) {
    return 'Good Afternoon,';
  }
  return 'Good Evening,';
};
