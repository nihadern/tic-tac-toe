const Players = {
  X: "X",
  O: "O",
  BLANK: " ",
};
function nextPlayer(currentPlayer) {
  return currentPlayer === Players.X ? Players.O : Players.X;
}
const SCORE = 1;
const BOARD_SIZE = 3;

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

  getChildMoves(nextPlayer) {
    const children = [];
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (this.state[i][j] === Players.BLANK) {
          const childState = this.copyState();
          childState[i][j] = nextPlayer;
          moves.push([i, j]);
          children.push(new TicTacToeBoard(childState));
        }
    return [children, moves];
  }

  copyState() {
    const copy = new Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++) {
      copy[i] = new Array(BOARD_SIZE);
      for (let j = 0; j < BOARD_SIZE; j++) copy[i][j] = this.state[i][j];
    }
    return copy;
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
    let [possibleStates, moves] = ticTacToeBoard.getChildMoves(this.playerTag);
    if (possibleStates.length > 0) {
      let maxValue = this.miniMax(
        possibleStates[0],
        0,
        nextPlayer(this.playerTag),
        Number.MIN_VALUE,
        Number.MAX_VALUE
      );
      let bestMove = moves[0];
      for (let i = 1; i < possibleStates.length; i++) {
        const moveValue = this.miniMax(
          possibleStates[i],
          0,
          nextPlayer(this.playerTag),
          Number.MIN_VALUE,
          Number.MAX_VALUE
        );
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
    const [possibleStates, moves] = ticTacToeBoard.getChildMoves(playerTag);
    if (moves.length === 0) return 0;

    // if the current player is agent, maximize scores
    if (playerTag === this.playerTag) {
      let maxValue = this.miniMax(
        possibleStates[0],
        depth + 1,
        nextPlayer(playerTag),
        alpha,
        beta
      );

      for (let i = 1; i < possibleStates.length; i++) {
        if (maxValue > alpha) alpha = maxValue;
        // beta cutoff
        if (alpha >= beta) break;
        maxValue = Math.max(
          maxValue,
          this.miniMax(
            possibleStates[i],
            depth + 1,
            nextPlayer(playerTag),
            alpha,
            beta
          )
        );
      }
      return maxValue;
    }
    // if the current player is not agent, minimize scores
    else {
      let minValue = this.miniMax(
        possibleStates[0],
        depth + 1,
        nextPlayer(playerTag),
        alpha,
        beta
      );
      for (let i = 1; i < possibleStates.length; i++) {
        if (minValue < beta) beta = minValue;
        // alpha cut-off
        if (alpha >= beta) break;
        minValue = Math.min(
          minValue,
          this.miniMax(
            possibleStates[i],
            depth + 1,
            nextPlayer(playerTag),
            alpha,
            beta
          )
        );
      }
      return minValue;
    }
  }
}
