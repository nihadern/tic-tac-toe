const BoardCell = {
  X: "X",
  O: "O",
  BLANK: " ",
};
const BOARD_SIZE = 4;

class TicTacToeBoard {
  constructor() {
    this.state = new Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++)
      this.state[i] = new Array(BOARD_SIZE).fill(BoardCell.BLANK);
  }

  addMove(row, col, player) {
    this.state[row][col] = player;
  }

  isEnd() {
    // check diagonal

    let temp = this.state[0][0];
    if (temp !== BoardCell.BLANK) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        if (this.state[i][i] !== temp) {
          temp = null;
          break;
        }
      }
      if (temp) return temp;
    }
    // check backward diagonal
    temp = this.state[0][BOARD_SIZE - 1];
    if (temp !== BoardCell.BLANK) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        if (this.state[i][BOARD_SIZE - i - 1] !== temp) {
          temp = null;
          break;
        }
      }
      if (temp) return temp;
    }

    // check  horizontal
    for (let i = 0; i < BOARD_SIZE; i++) {
      temp = this.state[i][0];
      if (temp !== BoardCell.BLANK) {
        for (let j = 1; j < BOARD_SIZE; j++)
          if (this.state[i][j] !== temp) {
            temp = null;
            break;
          }
        if (temp) return temp;
      }
    }

    // check  vertical
    for (let i = 0; i < BOARD_SIZE; i++) {
      temp = this.state[0][i];
      if (temp !== BoardCell.BLANK) {
        for (let j = 1; j < BOARD_SIZE; j++)
          if (this.state[j][i] !== temp) {
            temp = null;
            break;
          }
        if (temp) return temp;
      }
    }
    return false;
  }
}
