const Point = require('./Point');

function Sudoku(originData) {
    this.boards = (function initBoards() {
        let boards = [];
        for (let y = 0; y < 9; y++) {
            let line = []
            for (let x = 0; x < 9; x++) {
                line.push(new Point(x, y, originData[y][x]));
            }
            boards.push(line);
        }
        return boards;
    })();
    this.ruleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
Sudoku.prototype.removeDuplicateRow = function (point) {
    if (!point.num) {
        let originNums = [];
        for (let x = 0; x < 9; x++) {
            originNums.push(this.boards[point.col][x].num);
        }
        point.setCandidateNums(this.getAvailableNums(originNums));
    }
}
Sudoku.prototype.removeDuplicateCol = function (point) {
    let originNums = [];
    for (let y = 0; y < 9; y++) {
        originNums.push(this.boards[y][point.col].num);
    }
    point.setCandidateNums(this.getAvailableNums(originNums));
}
Sudoku.prototype.getAvailableNums = function (originNums) {
    let candidateNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < originNums.length; i++) {
        let originNum = originNums[i];
        let index = candidateNums.indexOf(originNum);
        if (index !== -1) {
            candidateNums.splice(candidateNums.indexOf(originNum), 1);
        }
    }
    return candidateNums;
}
module.exports = Sudoku