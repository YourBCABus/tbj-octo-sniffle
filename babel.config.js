module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        ['nativewind/babel'],
        ['module:react-native-dotenv', { allowUndefined: false }],
        'react-native-reanimated/plugin',
    ],
};
