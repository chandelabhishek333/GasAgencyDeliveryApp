import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userService } from '../../api/services/userService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Driver } from '../../types';

interface UserState {
  profile: Driver | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  status: 'idle',
  error: null,
};

/**
 * Screen 12 — the full driver profile. Distinct from `auth.driver`
 * (the lighter identity bundled with the login/OTP response): this is
 * independently (re-)fetchable, e.g. after a future EditProfile save.
 */
export const fetchProfile = createAsyncThunk<Driver, void, { rejectValue: string }>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load profile.';
      });
  },
});

export const userReducer = userSlice.reducer;
export type { UserState };
