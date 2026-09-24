import type { RootState } from '../index';

export const selectUserState = (state: RootState): RootState['user'] => state.user;
export const selectProfile = (state: RootState) => state.user.profile;
export const selectProfileStatus = (state: RootState) => state.user.status;
