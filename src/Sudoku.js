let Point = require('./Point.js');
let Grid = require('./Grid.js');

function Sudoku(originData) {
    this.boards = (function (Point) {
        let boards = [];
        for (let y = 0; y < 9; y++) {
            let line = []
            for (let x = 0; x < 9; x++) {
                line.push(new Point(x, y, originData[y][x]));
            }
            boards.push(line);
        }
        return boards;
    }(require('./Point.js')));
    this.ruleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.cachePoints = [];
    this.branchs = []
}
/**
 * 根据lineNums，获取某行合法数值
 * [3, 0, 0, 2, 8, 0, 4, 0, 5]==>[1,6,7,9]
 */
Sudoku.prototype.getAviableNumsByLineNums = function (lineNums) {
    let aviableNums = [];
    for (var i = 0; i < this.ruleNums.length; i++) {
        let ruleNum = this.ruleNums[i];
        lineNums.indexOf(ruleNum) == -1 && aviableNums.push(ruleNum);
    }
    return aviableNums;
}
/**
 * 根据可选数组，进一步过滤候选数组
 * @param {*} aviableNums 可选数组
 * @param {*} candidateNums 候选数组
 * [1,2,0,0,0,0,0,0,0],[1,6,7,9]==>[6,7,9]
 */
Sudoku.prototype.removeDuplicateNums = function (originNums, candidateNums) {
    for (let i = 0; i < originNums.length; i++) {
        let isExistIndex = candidateNums.indexOf(originNums[i]);
        isExistIndex != -1 && candidateNums.splice(isExistIndex, 1);
    }
    return candidateNums;
}
Sudoku.prototype.removeDuplicateRow = function (point) {
    if (!point.num) {
        let originNums = [];
        for (let x = 0; x < 9; x++) {
            this.boards[point.col][x].num && originNums.push(this.boards[point.col][x].num);
        }
        if (point.candidateNums.length > 0) {
            point.setCandidateNums(this.removeDuplicateNums(originNums, point.candidateNums));
        } else {
            point.setCandidateNums(this.getAviableNumsByLineNums(originNums));
        }
    }
}
Sudoku.prototype.removeDuplicateCol = function (point) {
    if (!point.num) {
        let originNums = [];
        for (let y = 0; y < 9; y++) {
            this.boards[y][point.row].num && originNums.push(this.boards[y][point.row].num);
        }
        if (point.candidateNums.length > 0) {
            point.setCandidateNums(this.removeDuplicateNums(originNums, point.candidateNums));
        } else {
            point.setCandidateNums(this.getAviableNumsByLineNums(originNums));
        }
    }
}
Sudoku.prototype.removeDuplicateSquare = function (point) {
    if (!point.num) {
        let Grid = require('./Grid.js');
        let startPointInGrid = new Grid(point.row, point.col).startPointInGrid;
        let originNums = []
        for (let y = startPointInGrid.col; y < startPointInGrid.col + 3; y++) {
            for (let x = startPointInGrid.row; x < startPointInGrid.row + 3; x++) {
                this.boards[y][x].num && originNums.push(this.boards[y][x].num);
            }
        }
        point.setCandidateNums(this.removeDuplicateNums(originNums, point.candidateNums));
    }
}

Sudoku.prototype.calc = function () {
    let oldBoard = JSON.parse(JSON.stringify(this.boards));
    this.excludeCalc();
    if (!this.canCalcContinue(oldBoard)) {
        this.saveCachePoints();
        this.oneByOnecandidateNumsCalc();
    }
}
Sudoku.prototype.excludeCalc = function () {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (x == 3 && y == 1) {
                console.log('debugger');
            }
            let point = this.boards[y][x];
            this.removeDuplicateSquare(point)
            this.removeDuplicateRow(point);
            this.removeDuplicateCol(point);
            this.validateSquare(point);
            this.validateRow(point);
            this.validateCol(point);
        }
    }
}
Sudoku.prototype.buildBranch = function () {
    let tempBranchs = []
    for (let i = 0; i < this.cachePoints.length; i++) {
        tempBranchs.push(this.setBranch[this.cachePoints[i]]);
    }
    for (let b = 0; b < tempBranchs.length; b++) {
        this.branchs.push({
            index: b,
            branchs: []
        })
    }
}
Sudoku.prototype.setBranch = function (point) {
    let branchs = [];
    for (let j = 0; j < point.candidateNums; j++) {
        branchs.push({
            row: point.row,
            col: point.col,
            num: point.candidateNums[j],
            index: j
        });
    }
    return branchs;
}
Sudoku.prototype.resetCachePoints = function () {
    for (let i = 0; i < this.cachePoints.length; i++) {
        this.boards[this.cachePoints[i].col][this.cachePoints[i].row].num = this.cachePoints[i].num;
    }
}
Sudoku.prototype.saveCachePoints = function () {
    let oldBoard = JSON.parse(JSON.stringify(this.boards));
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let point = oldBoard[y][x];
            if (point.num) {
                continue;
            }
            this.cachePoints.push(point);
        }
    }
}
Sudoku.prototype.canCalcContinue = function (oldBoard) {
    let remainCount = 81;
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (oldBoard[y][x].num == this.boards[y][x].num) {
                remainCount--;
            }
        }
    }
    console.log('change:' + remainCount);
    return remainCount;
}
Sudoku.prototype.validateSquare = function (point) {
    let Grid = require('./Grid.js');
    let startPointInGrid = new Grid(point.row, point.col).startPointInGrid;
    let originNums = []
    for (let y = startPointInGrid.col; y < 3; y++) {
        for (let x = startPointInGrid.row; x < 3; x++) {
            this.boards[y][x].num && originNums.push(this.boards[y][x].num);
        }
    }
    let appearNum = 0;
    for (let i = 0; i < originNums.length; i++) {
        let num = originNums[i];
        if (point.num && point.num == num) {
            appearNum++;
        }
        if (appearNum > 1) {
            throw new Error('square:[' + point.row + ',' + point.col + ']=' + num);
        }
    }
}
Sudoku.prototype.validateRow = function (point) {
    let appearNum = 0;
    for (let x = 0; x < 9; x++) {
        let num = this.boards[point.col][x].num;
        if (point.num && point.num == num) {
            appearNum++;
        }
        if (appearNum > 1) {
            throw new Error('row:[' + point.row + ',' + point.col + ']=' + num);
        }
    }
}
Sudoku.prototype.validateCol = function (point) {
    let appearNum = 0;
    for (let y = 0; y < 9; y++) {
        let num = this.boards[y][point.row].num;
        if (point.num && point.num == num) {
            appearNum++;
        }
        if (appearNum > 1) {
            throw new Error('col:[' + point.row + ',' + point.col + ']=' + num);
        }
    }
}
module.exports = Sudoku