function Point(row, col, num) {
    this.row = row;
    this.col = col;
    this.num = num;
    this.tryTime = 0;
    this.candidateNums = [];
    this.status = num && this.candidateNums.length == 0 ? 'frozen' : 'noknow';
    this.setCandidateNums = function (candidateNums) {
        this.candidateNums = candidateNums;
        if (candidateNums.length == 1) {
            // console.log('[' + col + ',' + row + ']=' + candidateNums);
            this.num = candidateNums[0];
            // this.candidateNums = []
        }
    }
    this.setTryTime = function () {
        this.tryTime++;
    }
};
module.exports = Point