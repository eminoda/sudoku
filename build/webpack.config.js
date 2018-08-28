const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        host: '0.0.0.0',
        port: 9000
    }
};