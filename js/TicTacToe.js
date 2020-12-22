// enumerations of possible states of board squares
const Players = {
  X: 1,
  O: 2,
  BLANK: 3,
};

// function to determine the next player. i.e. toggle X/O
function nextPlayer(currentPlayer) {
  return currentPlayer === Players.X ? Players.O : Players.X;
}

// constant for score used in minimax
const SCORE = 1;
// size of the tic-tac-toe square board 
let BOARD_SIZE = 4;

// object reoresentation of a tic tac toe board 
class TicTacToeBoard {
  constructor(state) {
    // use a board state if given
    if (state) this.state = state;
    else {
      // create an empty board
      this.state = new Array(BOARD_SIZE);
      for (let i = 0; i < BOARD_SIZE; i++)
        this.state[i] = new Array(BOARD_SIZE).fill(Players.BLANK);
    }
  }

  // helper function to add a move to board
  addMove(row, col, player) {
    this.state[row][col] = player;
  }

  // helper function to clear a move
  clearMove(row, col) {
    this.state[row][col] = Players.BLANK;
  }

  // helper function that finds all possible moves left on board
  getChildMoves() {
    const moves = [];
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (this.state[i][j] === Players.BLANK) moves.push([i, j]);

    return moves;
  }

  // copies the current state of board. 2D array copy. 
  copyState() {
    const copy = new Array(BOARD_SIZE);
    for (let i = 0; i < BOARD_SIZE; i++) {
      copy[i] = new Array(BOARD_SIZE);
      for (let j = 0; j < BOARD_SIZE; j++) copy[i][j] = this.state[i][j];
    }
    return copy;
  }

  // determines whether the current board has aby playable sqaures
  isPlayable() {
    for (let i = 0; i < BOARD_SIZE; i++)
      for (let j = 0; j < BOARD_SIZE; j++)
        if (this.state[i][j] === Players.BLANK) return true;
    return false;
  }


  // get the winner of the board if any otherwise return null
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

// Computer/AI agent that picks the optimal move using minimax algorithm
class TicTacToeAgent {
  constructor(playerTag, depthLimit = Number.MAX_VALUE) {
    // an agent has a tag: X/O 
    this.playerTag = playerTag;
    // optional depth limit to adjust difficulty
    this.depthLimit = depthLimit;
  }

  // given a board state return the most optimal move for the agent
  getBestMove(ticTacToeBoard) {
    // get all possible moves
    let moves = ticTacToeBoard.getChildMoves();
    // if any moves left
    if (moves.length > 0) {
      // the move with the highest value is the best move
      let maxValue = -Number.MAX_VALUE;
      let bestMove = null;
      //iterate through moves
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        // add move to board 
        ticTacToeBoard.addMove(row, col, this.playerTag);
        // minimax search to determine score of the move
        const moveValue = this.miniMax(
          ticTacToeBoard,
          0, // depth is 0 for start
          nextPlayer(this.playerTag),
          -Number.MAX_VALUE, // alpha is -infinity
          Number.MAX_VALUE // beta is infinity
        );
        // clear the move of the board 
        ticTacToeBoard.clearMove(row, col);
        // replace the best move if the maxValue is greater 
        if (moveValue > maxValue) {
          maxValue = moveValue;
          bestMove = moves[i];
        }
      }
      // return the best move
      return bestMove;
    } else return null; // no moves returns null
  }

  // recursive depth-limited funtion for minimax with alpha-beta pruning 
  miniMax(ticTacToeBoard, depth, playerTag, alpha, beta) {
    // check for depth limit and return if depth higher than limit
    if (depth > this.depthLimit) return 0;
    const winner = ticTacToeBoard.getWinner();
    // if there is a winner return positive score if agent wins
    // or negative score if opponent wins
    if (winner) return winner === this.playerTag ? SCORE : -SCORE;

    // get all possible moves
    const moves = ticTacToeBoard.getChildMoves();
    // if no possible moves and no winner, its a draw
    if (moves.length === 0) return 0;

    // if the current player is agent, maximize scores
    if (playerTag === this.playerTag) {
      // max will pick the move with the maximum value
      let maxValue = -Number.MAX_VALUE;
      // iterate through moves
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        // add move to board
        ticTacToeBoard.addMove(row, col, playerTag);
        // compute score and replace the maxValue if higher
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
        // remove the move 
        ticTacToeBoard.clearMove(row, col);
        // update alpha
        alpha = Math.max(alpha, maxValue);
        // beta cutoff
        if (alpha >= beta) break;
      }
      return maxValue;
    }
    // if the current player is not agent, minimize scores
    else {
      // the min player will pick move which minimizes score
      let minValue = Number.MAX_VALUE;
      // iterate through moves 
      for (let i = 0; i < moves.length; i++) {
        const [row, col] = moves[i];
        // add the move to board
        ticTacToeBoard.addMove(row, col, playerTag);
        // compute score and replace the minValue if lower
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
        // clear the move
        ticTacToeBoard.clearMove(row, col);
        // update beta 
        beta = Math.min(beta, minValue);
        // alpha cut-off
        if (alpha >= beta) break;
      }
      return minValue;
    }
  }
}
