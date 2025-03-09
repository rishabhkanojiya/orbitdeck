const paths = require("./paths");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require("path");

module.exports = merge(common, {
    // Set the mode to development or production
    mode: "development",

    // Control how source maps are generated
    devtool: "inline-source-map",

    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        contentBase: paths.build,
        open: false,
        compress: true,
        hot: true,
        port: 3000,
    },

    module: {
        rules: [
            {
                test: /\.[js]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve("babel-loader"),
                        options: {
                            plugins: [
                                require.resolve("react-refresh/babel"),
                            ].filter(Boolean),
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            additionalData: `@import "src/styles/abstracts/index.scss";`,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                ident: "postcss",
                                plugins: [autoprefixer],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new Dotenv({
            // path: "./.env.development",
            systemvars: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
});
