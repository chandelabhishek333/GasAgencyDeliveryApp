// TODO: confirm endpoints — Payments screens are scaffolded
// (src/screens/Payments/) but weren't part of the original 13-screen
// spec. Wired to match the service list documented in src/api/README.md.
export const PAYMENT_ENDPOINTS = {
  METHODS: '/payments/methods',
  METHOD_DETAIL: (methodId: string): string => `/payments/methods/${methodId}`,
  HISTORY: '/payments/history',
} as const;
