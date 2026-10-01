module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // The codebase relies on exhaustive-deps for correctness in data-
    // fetching hooks (useEffect + dispatch) — keep it a warning, not
    // an error, so it's visible without blocking builds.
    'react-hooks/exhaustive-deps': 'warn',
  },
};
