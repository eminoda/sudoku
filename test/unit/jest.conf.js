// config:https://facebook.github.io/jest/docs/en/configuration.html
// cli:https://facebook.github.io/jest/docs/en/cli.html
const path = require('path')

module.exports = {
    verbose: true, //详细输出
    rootDir: path.resolve(__dirname, '../../'), //设置全局路径，指向server下
    moduleFileExtensions: ["js", "ts"],
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/$1'
    }, //简化引用
    testPathIgnorePatterns: [
        '<rootDir>/test/e2e'
    ],
    collectCoverage: false, //开启分析
    coverageDirectory: '<rootDir>/test/unit/coverage', //报告打印路径
    collectCoverageFrom: [
        '*.js',
    ]
};