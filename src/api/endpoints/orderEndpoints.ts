export const ORDER_ENDPOINTS = {
  LIST: '/orders',
  DETAIL: (orderId: string): string => `/orders/${orderId}`,
  HISTORY: '/orders/history',
} as const;
