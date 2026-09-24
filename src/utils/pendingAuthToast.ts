/**
 * A one-shot toast message that survives the Redux `auth` state reset a
 * logout triggers. RootNavigator swaps AuthStack back in the instant
 * `isAuthenticated` flips false, unmounting whatever screen called
 * logoutUser before it could show its own toast — so the message can't
 * live in authSlice (it gets wiped by the same reset) or be shown from
 * that screen (it's already gone). Plain in-memory state is enough: it
 * only needs to survive the Splash -> Login remount within this same
 * app session, not an app restart, and Login consumes it exactly once.
 */
let pendingMessage: string | null = null;

export const setPendingAuthToast = (message: string): void => {
  pendingMessage = message;
};

/** Reads and clears the pending message in one step, so a re-render (e.g. Fast Refresh) never redisplays it. */
export const consumePendingAuthToast = (): string | null => {
  const message = pendingMessage;
  pendingMessage = null;
  return message;
};
