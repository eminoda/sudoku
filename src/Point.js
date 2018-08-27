function Point(row, col, num) {
    this.row = row;
    this.col = col;
    this.num = num;
    this.candidateNums = [];
    this.status = num && this.candidateNums.length == 0 ? 'frozen' : 'noknow';
    this.setCandidateNums = function (candidateNums) {
        this.candidateNums = candidateNums;
        if (candidateNums.length == 1) {
            this.num = candidateNums[0];
        }
    }
};
module.exports = Point