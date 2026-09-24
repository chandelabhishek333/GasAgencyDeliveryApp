import { ApiError } from '../types';

/**
 * Extracts a user-facing message from any thrown value. Used by every
 * async thunk's `rejectWithValue` so slices never store raw
 * error/response objects (see src/store/README.md's normalization rule).
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};
