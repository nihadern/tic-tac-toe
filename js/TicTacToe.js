const Players = {
  X: 1,
  O: 2,
  BLANK: 3,
};
function nextPlayer(currentPlayer) {
  return currentPlayer === Players.X ? Players.O : Players.X;
}
const SCORE = 1;
let BOARD_SIZE = 4;

class TicTacToeBoard {
  constructor(state) {
    if (state) this.state = state;
    else {
      this.state = new Array(BOARD_SIZE);
      for (let i = 0; i < BOARD_SIZE; i++)
        this.state[i] = new Array(BOARD_SIZE).fill(Players.BLANK);
    }
  }

  addMove(row, col, player) {
    this.state[row][col] = player;
  }

  clearMove(row, col) {
    this.state[row][col] = Players.BLANK;
  }

  getChildMoves() {
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (this.state[i][j] === Players.BLANK) moves.push([i, j]);

    return moves;
  }

  copyState() {
    const copy = new Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++) {
      copy[i] = new Array(BOARD_SIZE);
      for (let j = 0; j < BOARD_SIZE; j++) copy[i][j] = this.state[i][j];
    }
    return copy;
  }

  isPlayable() {
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (this.state[i][j] === Players.BLANK) return true;
    return false;
  }

  getWinner() {
    // check diagonal
    let temp = this.state[0][0];
    if (temp !== Players.BLANK) {
      for (let i = 1; i < BOARD_SIZE; i++)
        if (this.state[i][i] !== temp) {
          temp = null;
          break;
        }
      if (temp) return temp;
    }

    // check backward diagonal
    temp = this.state[0][BOARD_SIZE - 1];
    if (temp !== Players.BLANK) {
      for (let i = 1; i < BOARD_SIZE; i++)
        if (this.state[i][BOARD_SIZE - i - 1] !== temp) {
          temp = null;
          break;
        }
      if (temp) return temp;
    }

    // check  horizontal
    for (let i = 0; i < BOARD_SIZE; i++) {
      temp = this.state[i][0];
      if (temp !== Players.BLANK) {
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
      if (temp !== Players.BLANK) {
        for (let j = 1; j < BOARD_SIZE; j++)
          if (this.state[j][i] !== temp) {
            temp = null;
            break;
          }
        if (temp) return temp;
      }
    }
    return null;
  }
}

class TicTacToeAgent {
  constructor(playerTag) {
    this.playerTag = playerTag;
  }

  getBestMove(ticTacToeBoard) {
    // get all possible
    let moves = ticTacToeBoard.getChildMoves();
    if (moves.length > 0) {
      let maxValue = -Number.MAX_VALUE;
      let bestMove = null;
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        ticTacToeBoard.addMove(row, col, this.playerTag);
        const moveValue = this.miniMax(
          ticTacToeBoard,
          0,
          nextPlayer(this.playerTag),
          -Number.MAX_VALUE,
          Number.MAX_VALUE
        );
        ticTacToeBoard.clearMove(row, col);
        console.log(row, col);
        if (moveValue > maxValue) {
          maxValue = moveValue;
          bestMove = moves[i];
        }
      }
      return bestMove;
    } else return null;
  }

  miniMax(ticTacToeBoard, depth, playerTag, alpha, beta) {
    const winner = ticTacToeBoard.getWinner();
    // if there is a winner return positive score if agent wins
    // or negative score if opponent wins
    if (winner) return winner === this.playerTag ? SCORE : -SCORE;

    // get all possible moves
    const moves = ticTacToeBoard.getChildMoves();
    if (moves.length === 0) return 0;

    // if the current player is agent, maximize scores
    if (playerTag === this.playerTag) {
      let maxValue = -Number.MAX_VALUE;
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        ticTacToeBoard.addMove(row, col, playerTag);
        maxValue = Math.max(
          maxValue,
          this.miniMax(
            ticTacToeBoard,
            depth + 1,
            nextPlayer(playerTag),
            alpha,
            beta
          )
        );
        ticTacToeBoard.clearMove(row, col);
        alpha = Math.max(alpha, maxValue);
        // beta cutoff
        if (alpha >= beta) break;
      }
      return maxValue;
    }
    // if the current player is not agent, minimize scores
    else {
      let minValue = Number.MAX_VALUE;
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        ticTacToeBoard.addMove(row, col, playerTag);
        minValue = Math.min(
          minValue,
          this.miniMax(
            ticTacToeBoard,
            depth + 1,
            nextPlayer(playerTag),
            alpha,
            beta
          )
        );
        ticTacToeBoard.clearMove(row, col);
        beta = Math.min(beta, minValue);
        // alpha cut-off
        if (alpha >= beta) break;
      }
      return minValue;
    }
  }
}
