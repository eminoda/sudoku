const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * webpack v4.x
 */
module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, '..', 'src'),
    entry: {
        sudoku: './index.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist'),
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: '../index.html',
        inject: true
    })],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        host: '127.0.0.1',
        port: 3000
    }
};