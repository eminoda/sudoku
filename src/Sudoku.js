var Point = require('./Point.js');
let Grid = require('./Grid.js');
var _ = require('lodash');

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
    this.oldBoard = [];
    this.ruleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.cachePoints = [];
    this.cacheError = false;
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
    this.excludeCalc();
    if (!this.canContinue(this.boards)) {
        this.cachePoints = [];
        var newCachePoints = this.getCachePoints(this.boards);
        this.oldBoard.push(_.cloneDeep(this.boards));
        return this.oneByOnecandidateNumsCalc(0, newCachePoints);
    }
}
Sudoku.prototype.excludeCalc = function () {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            // if (x == 3 && y == 1) {
            //     console.log('debugger');
            // }
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
Sudoku.prototype.oneByOnecandidateNumsCalc = function (currentIndex, cachePoints) {
    if (currentIndex < 0) {
        throw new Error('data error');
    }
    if (this.isOver(JSON.parse(JSON.stringify(this.boards)))) {
        return this.boards
    }
    for (let i = currentIndex; i < cachePoints.length; i++) {
        if (i == 0) {
            console.log('start');
        }
        console.log('i=' + i + ',oldBoard=' + this.oldBoard.length);
        var cachePoint = cachePoints[i];
        if (cachePoint.col == 4 && cachePoint.row == 3) {
            console.log('debug');
        }
        try {
            // 假设数值
            var num = cachePoint.candidateNums[cachePoint.tryTime];
            console.log('[' + cachePoint.col + ',' + cachePoint.row + ']==>' + num + '   ,[' + cachePoint.candidateNums + ']');
            if (num == this.boards[cachePoint.col][cachePoint.row].num) {
                this.oldBoard.push(this.getTempBoard(this.boards));
                cachePoint.tryTime = cachePoint.candidateNums.indexOf(num);
                continue;
            }
            this.boards[cachePoint.col][cachePoint.row].num = num;
            this.excludeCalc();
            this.oldBoard.push(this.getTempBoard(this.boards));
        } catch (err) {
            console.error(err.message);
            this.oldBoard.push(this.getTempBoard(this.boards));
            // 异常确认上级数据
            let currentI = this.goBackCachePoint(cachePoints, i);
            console.log('oldBoards.length=' + this.oldBoard.length);
            return this.oneByOnecandidateNumsCalc(currentI, cachePoints);
        }
    }
}
Sudoku.prototype.goBackCachePoint = function (cachePoints, i) {
    console.log('be back ---- i=' + i);
    // 面板回退上一级
    this.setLastBoard();
    var lastCachePoint = cachePoints[i];
    // 父级有候选值
    if (lastCachePoint.tryTime + 1 < lastCachePoint.candidateNums.length) {
        lastCachePoint.tryTime++;
        return i;
    } else {
        // 父级重置次数，返回祖级
        lastCachePoint.tryTime = 0;
        i = i - 1;
        return this.goBackCachePoint(cachePoints, i);
    }
}
Sudoku.prototype.setLastBoard = function () {
    this.oldBoard.splice(this.oldBoard.length - 1, 1);
    // shit
    this.boards = _.cloneDeep(this.oldBoard[this.oldBoard.length - 1]);
}
Sudoku.prototype.getTempBoard = function (boards) {
    return _.cloneDeep(boards);
    // return JSON.parse(JSON.stringify(boards));
}
Sudoku.prototype.resetCachePoints = function () {
    for (let i = 0; i < this.cachePoints.length; i++) {
        this.boards[this.cachePoints[i].col][this.cachePoints[i].row].candidateNums = this.cachePoints[i].candidateNums;
    }
}
Sudoku.prototype.getCachePoints = function (boards) {
    boards = boards || this.boards;
    let cachePoints = [];
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let point = new Point(boards[y][x].row, boards[y][x].col, boards[y][x].num);
            point.candidateNums = _.cloneDeep(boards[y][x].candidateNums);
            if (point.num) {
                continue;
            }
            cachePoints.push(point);
        }
    }
    return cachePoints;
}
Sudoku.prototype.canContinue = function (oldBoard) {
    let remainCount = 81;
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (oldBoard[y][x].num == this.boards[y][x].num) {
                remainCount--;
            }
        }
    }
    // console.log('change:' + remainCount);
    return remainCount;
}
Sudoku.prototype.isOver = function () {
    let remainCount = 0;
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (this.boards[y][x].num) {
                remainCount++;
            }
        }
    }
    // console.log('change:' + remainCount);
    return remainCount == 81;
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
            throw new Error('square:[' + point.col + ',' + point.row + ']=' + num);
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
            throw new Error('row:[' + point.col + ',' + point.row + ']=' + num);
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
            throw new Error('col:[' + point.col + ',' + point.row + ']=' + num);
        }
    }
}
module.exports = Sudoku