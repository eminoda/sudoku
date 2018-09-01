function Box(row, col) {
    // 获取每个小9宫格的起始坐标
    this.startPointInBox = (function getStartPoint() {
        return {
            row: Math.floor(row / 3) * 3,
            col: Math.floor(col / 3) * 3
        }
    })()
}
module.exports = Box;