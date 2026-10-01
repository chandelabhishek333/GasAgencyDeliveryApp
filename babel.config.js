// tsconfig.json's `paths` only makes TypeScript/the IDE understand the
// aliases — Metro still needs babel-plugin-module-resolver to actually
// resolve them at bundle time. Keep this alias map in sync with
// tsconfig.json's `paths`.
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@theme': './src/theme',
          '@components': './src/components',
          '@screens': './src/screens',
          '@store': './src/store',
          '@api': './src/api',
          '@constants': './src/constants',
          '@app-types': './src/types',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@assets': './src/assets',
          '@config': './src/config',
          '@contexts': './src/contexts',
        },
      },
    ],
  ],
};
