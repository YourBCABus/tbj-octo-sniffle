const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
    test: /\.[jt]sx?$/,
    // Add every directory that needs to be compiled by Babel during the build.
    include: [
        path.resolve(appDirectory, 'index.web.js'),
        path.resolve(appDirectory, 'App.tsx'),
        path.resolve(appDirectory, 'src'),
        path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
        path.resolve(appDirectory, 'node_modules/react-native/Libraries'),
        path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
        path.resolve(appDirectory, 'node_modules/react-native-linear-gradient'),
        path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
        path.resolve(appDirectory, 'node_modules/@gorhom/bottom-sheet'),
    ],
    // loader: 'babel-loader',
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
            presets: [
                [
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'entry',
                        corejs: '3.22',
                    },
                ],
                'module:metro-react-native-babel-preset',
                '@babel/preset-flow',
                [
                    '@babel/preset-react',
                    {
                        flow: false,
                        typescript: true,
                    },
                ],
                // [
                //     '@babel/preset-typescript',
                //     {
                //         allExtensions: true,
                //         isTSX: true,
                //     },
                // ],
            ],
            // Re-write paths to import only the modules needed by the app
            plugins: [
                ['nativewind/babel'],
                ['module:react-native-dotenv', { allowUndefined: false }],
                'react-native-reanimated/plugin',
                'react-native-web',
                '@babel/plugin-transform-react-jsx',
            ],
        },
    },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'url-loader',
        options: {
            name: '[name].[ext]',
            esModule: false,
        },
    },
};

const typescriptLoaderConfiguration = {
    test: /\.tsx?$/,
    use: {
        loader: 'ts-loader',
        options: {
            configFile: 'tsconfig.web.json',
        },
    },
    exclude: /node_modules/,
};

module.exports = {
    entry: [
        // load any web API polyfills
        // path.resolve(appDirectory, 'polyfills-web.js'),
        // your web-specific entry file
        // path.resolve(appDirectory, 'index.web.js'),
        path.resolve(appDirectory, 'index.web.js'),
    ],

    // configures where the build ends up
    output: {
        publicPath: '',
        filename: 'bundle.web.js',
        path: path.resolve(appDirectory, 'dist'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'TableJet',
            template: 'public/index.html',
            // this is a workaround for the injection of the code from the output file into the .html
            // the injection will be handled in the template file
            inject: false,
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'resources/fonts/teacher-state-icons.ttf',
                    to: 'teacher-state-icons.ttf',
                },
                {
                    from: 'node_modules/react-native-vector-icons/Fonts/Ionicons.ttf',
                    to: 'Ionicons.ttf',
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/[!i]*',
                    to: '[name][ext]',
                },
                {
                    from: 'public/icons/homescreen192.png',
                    to: 'apple-touch-icon.png',
                },
            ],
        }),
    ],

    // ...the rest of your config

    module: {
        rules: [
            // typescriptLoaderConfiguration,
            babelLoaderConfiguration,
            imageLoaderConfiguration,
        ],
    },

    resolve: {
        // This will only alias the exact import "react-native"
        alias: {
            'react-native$': 'react-native-web',
        },
        // If you're working on a multi-platform React Native app, web-specific
        // module implementations should be written in files using the extension
        // `.web.js`.
        extensions: [
            '.web.js',
            '.js',

            '.web.jsx',
            '.jsx',

            '.web.ts',
            '.ts',

            '.web.tsx',
            '.tsx',

            '.svg',
        ],
    },
    devServer: {
        liveReload: false,
        proxy: [
            {
                context: ['/error', '/signin', '/dashboard', '/setup', '/settings', '/main'],
                target: 'http://localhost:8080',
                pathRewrite: { '^.+': '/' },
            },
        ],
    },
};
