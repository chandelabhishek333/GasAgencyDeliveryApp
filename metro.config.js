const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Path aliases (@theme, @components, etc.) are resolved by
// babel-plugin-module-resolver during the babel transform, so Metro
// itself needs no special alias config.
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
