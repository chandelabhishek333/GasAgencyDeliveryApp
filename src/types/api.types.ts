/**
 * Generic success/error envelope returned by the MBGA backend, per
 * docs/api/API_REFERENCE.md. Every service method unwraps `data`
 * (errors never reach services — they're normalized and thrown by
 * src/api/interceptors/errorInterceptor.ts as `ApiError`).
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

/** Normalized error thrown by src/api/interceptors/errorInterceptor.ts. */
export class ApiError extends Error {
  code: string;

  statusCode: number;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.code = payload.code;
    this.statusCode = payload.statusCode;
  }
}

/** Standard shape for paginated list endpoints (orders, history, payments). */
export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
