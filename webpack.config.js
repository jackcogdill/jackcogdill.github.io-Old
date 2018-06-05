const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const SRC = path.resolve(__dirname, 'src');
const DEST = path.resolve(__dirname, '.');

module.exports = {
    output: {
        path: DEST,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: SRC + '/js',
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.html$/,
                include: SRC,
                use: [{ loader: 'html-loader', options: { minimize: true } }],
            },
            {
                test: /\.scss$/,
                include: SRC + '/css',
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|svg|jpe?g)$/,
                include: SRC + '/images',
                use: { loader: 'file-loader?name=images/[name].[ext]' },
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
    ]
};
