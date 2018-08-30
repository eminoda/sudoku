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
    let oldBoard = JSON.parse(JSON.stringify(this.boards));
    this.excludeCalc();
    if (!this.canCalcContinue(oldBoard)) {
        this.cachePoints = [];
        this.oldBoard.push(this.getTempBoard(this.boards));
        var newCachePoints = this.getCachePoints(oldBoard);
        // this.oneByOnecandidateNumsCalc(0, newCachePoints);
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

Sudoku.prototype.createCachePoints = function (root, cachePoints) {
    for (let i = 0; i < cachePoints.length; i++) {
        let cachePoint = cachePoint[i];
        cachePoints.splice(i, 1);
        root[cachePoint.num] = [cachePoint, cachePoints]
    }
}
Sudoku.prototype.buildTree = function (cachePoint, childs) {
    for (let i = 0; i < cachePoint.candidateNums.length; i++) {

    }
}
Sudoku.prototype.oneByOnecandidateNumsCalc = function (currentIndex, cachePoints) {
    if (currentIndex < 0) {
        throw new Error('data error');
    }
    for (let i = currentIndex; i < cachePoints.length; i++) {
        var cachePoint = cachePoints[i];
        try {
            // 假设数值
            var num = cachePoint.candidateNums[cachePoint.tryTime];
            console.debug('cachePoint:' + '[' + cachePoint.col + ',' + cachePoint.row + '] , tryTime= ' + cachePoint.tryTime + ' ,arr= ' + cachePoint.candidateNums);
            // 以计算完毕
            // if (!cachePoint.tryTime && this.boards[cachePoint.col][cachePoint.row].num) {
            //     console.error('have num:' + num);
            //     continue;
            // }
            console.log(this.boards[cachePoint.col][cachePoint.row].num + '==>' + num);
            // this.boards[cachePoint.col][cachePoint.row].num = num;
            // 刷新面板
            this.excludeCalc();
            // this.oldBoard.push(this.getTempBoard(this.boards));
            this.oneByOnecandidateNumsCalc(++i, cachePoints);
        } catch (err) {
            console.error(err.message);
            this.oldBoard.push(this.getTempBoard(this.boards));
            this.oldBoard.splice(this.oldBoard.length - 1, 1);
            this.boards = this.oldBoard[this.oldBoard.length - 1];
            this.boards[cachePoint.col][cachePoint.row].num = 0;
            if (cachePoint.tryTime + 1 > cachePoint.candidateNums.length) {
                throw new Error('over');
            }
            // 当前坐标无候选值，回溯
            if (cachePoint.tryTime + 1 == cachePoint.candidateNums.length) {
                // this.oldBoard.splice(this.oldBoard.length - 1, 1);
                // this.boards = this.oldBoard[this.oldBoard.length - 1];
                cachePoint.tryTime = 0;
                i--;
                cachePoints[i].tryTime++;
                // if (cachePoints[i].tryTime >= cachePoints[i].candidateNums.length) {
                //     i--
                // }
                i = this.goBackCachePoint(cachePoints, i);
                this.oneByOnecandidateNumsCalc(i, cachePoints);
            } else {
                cachePoint.tryTime++;
                this.oneByOnecandidateNumsCalc(i, cachePoints);
            }
        }
    }
}
Sudoku.prototype.goBackCachePoint = function (cachePoints, i) {
    if (cachePoints[i].tryTime > cachePoints[i].candidateNums.length) {
        this.oldBoard.splice(this.oldBoard.length - 1, 1);
        this.boards = this.oldBoard[this.oldBoard.length - 1];
        cachePoints[i].tryTime = 0;
        i--;
        cachePoints[i].tryTime++;
        return this.goBackCachePoint(cachePoints, i);
    } else {
        return i;
    }
}
Sudoku.prototype.getTempBoard = function (boards) {
    return _.cloneDeep(boards)
}
// 创建新的缓存区
Sudoku.prototype.createNewCachePoints = function (cachePoints) {
    let newCachePoints = [];
    for (let i = 0; i < cachePoints.length; i++) {
        newCachePoints.push(cachePoints[i]);
    }
    return newCachePoints;
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
            point.candidateNums = boards[y][x].candidateNums;
            if (point.num) {
                continue;
            }
            cachePoints.push(point);
        }
    }
    return cachePoints;
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