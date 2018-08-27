const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        sudoku: path.join(__dirname, '../src/index.js')
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
    mode: 'development',
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
    })],
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 9000
    }
};