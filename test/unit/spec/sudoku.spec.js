const Sudoku = require('../../../src/Sudoku');
var Box = require('../../../src/Box');
const Point = require('../../../src/Point');
const _ = require('lodash');
var originData = [
    [3, 0, 0, 2, 8, 0, 4, 0, 5],
    [0, 2, 0, 0, 0, 0, 7, 0, 0],
    [5, 1, 9, 7, 0, 6, 3, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [9, 0, 1, 0, 0, 0, 2, 0, 7],
    [0, 0, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 6, 8, 0, 4, 1, 2, 3],
    [0, 0, 3, 0, 0, 0, 0, 5, 0],
    [2, 0, 4, 0, 3, 1, 0, 0, 6]
];
describe('Test sudoku', () => {
    test('Point create', () => {
        let point = new Point(1, 2, 5);
        expect(point.status).toEqual('frozen');
    })
    test('Point setCandidateNums', () => {
        let point = new Point(0, 1, 0);
        point.setCandidateNums([6, 7]);
        expect(point.candidateNums).toEqual([6, 7]);
    })
    test('Box create', () => {
        let box = new Box(1, 2);
        expect(box.startPointInBox.row).toEqual(0);
        expect(box.startPointInBox.col).toEqual(0);
    })
    test('Sudoku create', () => {
        let sudoku = new Sudoku(originData);
        expect(sudoku.boards[0][0].num).toEqual(3);
    })
    test('Sudoku getAviableNumsByLineNums', () => {
        let sudoku = new Sudoku(originData);
        expect(sudoku.getAviableNumsByLineNums([3, 0, 0, 2, 8, 0, 4, 0, 5])).toEqual([1, 6, 7, 9]);
    })
    test('Sudoku removeDuplicateNums', () => {
        let sudoku = new Sudoku(originData);
        expect(sudoku.removeDuplicateNums([1, 2, 0, 0, 0, 0, 0, 0, 0], [1, 6, 7, 9])).toEqual([6, 7, 9]);
    })
    test('Sudoku removeDuplicateRow', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[0][1];
        sudoku.removeDuplicateRow(point);
        expect(point.candidateNums).toEqual([1, 6, 7, 9])
    })
    test('Sudoku removeDuplicateCol', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[0][1];
        sudoku.removeDuplicateRow(point);
        sudoku.removeDuplicateCol(point);
        expect(point.candidateNums).toEqual([6, 7, 9])
    })
    test('Sudoku removeDuplicateCol2', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[0][1];
        sudoku.removeDuplicateCol(point);
        expect(point.candidateNums).toEqual([3, 4, 5, 6, 7, 8, 9])
    })
    test('Sudoku removeDuplicateSquare', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[0][1];
        sudoku.removeDuplicateRow(point);
        sudoku.removeDuplicateCol(point);
        sudoku.removeDuplicateSquare(point)
        expect(point.candidateNums).toEqual([6, 7])
    })
    test('test DeepClone', () => {
        var testArr = [];
        var test = {
            name: 11
        }
        var testCopy = _.cloneDeep(test);
        testArr.push(testCopy);
        test.name = 22;
        expect(testArr[0].name).toEqual(11);
    })
});