# src/api/ — API Layer

Centralizes **all communication with external API endpoints**.  
No screen or hook should call `fetch` or `axios` directly — they must go through this layer.

---

## Structure

```
api/
├── client.ts              # Axios instance with base URL & timeout
├── endpoints/             # Endpoint URL constants (grouped by domain)
│   ├── authEndpoints.ts
│   ├── orderEndpoints.ts
│   ├── deliveryEndpoints.ts
│   ├── userEndpoints.ts
│   └── paymentEndpoints.ts
├── interceptors/          # Request & response interceptors
│   ├── authInterceptor.ts # Attaches Bearer token to every request
│   └── errorInterceptor.ts# Global error handling & token refresh
└── services/              # One service class/file per domain
    ├── authService.ts
    ├── orderService.ts
    ├── deliveryService.ts
    ├── userService.ts
    └── paymentService.ts
```

---

## How to Add a New Endpoint

1. Add the URL constant to the relevant file in `endpoints/`.
2. Create or update the matching service in `services/`.
3. Call the service method from a custom hook in `src/hooks/`.
4. Document the endpoint in `docs/api/`.

---

## Error Handling

All errors are caught in `interceptors/errorInterceptor.ts` and normalized to a standard shape before being thrown. Services should **not** swallow errors — let them propagate to the hook layer.
