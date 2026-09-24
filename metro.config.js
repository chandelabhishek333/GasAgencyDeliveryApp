const { getDefaultConfig } = require('expo/metro-config');

// Path aliases (@theme, @components, etc.) are resolved by
// babel-plugin-module-resolver during the babel transform, so Metro
// itself needs no special alias config.
module.exports = getDefaultConfig(__dirname);
