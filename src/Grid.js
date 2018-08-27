function Grid(row, col) {
    this.startPointInGrid = (function getStartPoint() {
        return {
            row: Math.floor(row / 3),
            col: Math.floor(col / 3)
        }
    })()
}
module.exports = Grid;