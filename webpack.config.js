/* eslint-disable prefer-template */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    context: __dirname + "/src",
    entry: "./index",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {test: /\.(png|gif|jpeg)$/, loader: "url"},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {presets: ['es2015']},
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fi/),
    ],
};
