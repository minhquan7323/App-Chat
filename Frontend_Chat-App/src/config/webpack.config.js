module.exports = {
    // Other Webpack config...
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [
                        require.resolve('react-app'),
                        '@babel/preset-env',
                    ],
                    plugins: [
                        '@babel/plugin-proposal-private-methods',
                        '@babel/plugin-proposal-private-property-in-object'
                    ],
                },
            },
        ],
    },
};
