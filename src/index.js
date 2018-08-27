const Vue = require('vue');
const Sudoku = require('./Sudoku');
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
]);
var app = new Vue({
    el: '#app',
    data: {
        boards: sudoku.boards
    },
    methods: {
        calc: function () {
            for (let x = 0; x < 9; x++) {
                sudoku.removeDuplicateRow(this.boards[0][x]);
                this.boards = sudoku.boards;
            }
        }
    }
})