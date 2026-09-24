/** Formats an ISO timestamp as a short relative time: "2 mins ago", "3 hours ago", "1 day ago". */
export const formatRelativeTime = (isoDate: string, now: Date = new Date()): string => {
  const then = new Date(isoDate);
  const diffMinutes = Math.floor((now.getTime() - then.getTime()) / 60000);

  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? '' : 's'} ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};
