const Sudoku = require('../../../src/Sudoku');
const Grid = require('../../../src/Grid');
const Point = require('../../../src/Point');
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
    test('Grid create', () => {
        let grid = new Grid(1, 2);
        expect(grid.startPointInGrid).toEqual({
            row: 0,
            col: 0
        });
        grid = new Grid(8, 8);
        expect(grid.startPointInGrid).toEqual({
            row: 2,
            col: 2
        });
    })
    test('Sudoku create', () => {
        let sudoku = new Sudoku(originData);
        expect(sudoku.boards[0][0].num).toEqual(3);
    })
    test('Sudoku getAvailableNums', () => {
        let sudoku = new Sudoku(originData);
        expect(sudoku.getAvailableNums([3, 0, 0, 2, 8, 0, 4, 0, 5])).toEqual([1, 6, 7, 9]);
    })
    test('Sudoku removeDuplicateRow', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[0][1];
        sudoku.removeDuplicateRow(point);
        expect(point.candidateNums).toEqual([1, 6, 7, 9])
    })
    test('Sudoku removeDuplicateCol', () => {
        let sudoku = new Sudoku(originData);
        let point = sudoku.boards[8][6];
        sudoku.removeDuplicateRow(point);
        expect(point.candidateNums).toEqual([5, 7, 8, 9])
    })
});