require('./index.scss');
const Vue = require('vue');
const Sudoku = require('./Sudoku.js');
const Point = require('./Point.js');
let sudoku = new Sudoku([
    [3, 0, 0, 2, 8, 0, 4, 0, 5],
    [0, 2, 0, 0, 0, 0, 7, 0, 0],
    [5, 1, 9, 7, 0, 6, 3, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [9, 0, 1, 0, 0, 0, 2, 0, 7],
    [0, 0, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 6, 8, 0, 4, 1, 2, 3],
    [0, 0, 3, 0, 0, 0, 0, 5, 0],
    [2, 0, 4, 0, 3, 1, 0, 0, 6]
], Point);
new Vue({
    el: '#app',
    data: {
        boards: sudoku.boards
    },
    methods: {
        calc: function () {
            this.boards = sudoku.calc();
        },
        reset: function () {
            this.boards = new Sudoku([
                [3, 0, 0, 2, 8, 0, 4, 0, 5],
                [0, 2, 0, 0, 0, 0, 7, 0, 0],
                [5, 1, 9, 7, 0, 6, 3, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0],
                [9, 0, 1, 0, 0, 0, 2, 0, 7],
                [0, 0, 0, 0, 0, 7, 0, 0, 0],
                [0, 0, 6, 8, 0, 4, 1, 2, 3],
                [0, 0, 3, 0, 0, 0, 0, 5, 0],
                [2, 0, 4, 0, 3, 1, 0, 0, 6]
            ]).boards
        }
    }
})