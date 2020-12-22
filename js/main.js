// game starts with X
var currentPlayer = Players.X;
// the board for the game
var ticTacToeBoard = new TicTacToeBoard();
// toggle for Human vs. AI or Human vs. Human
var playWithAgent = true;
// the compuer/AI agent plays second
var agent = new TicTacToeAgent(nextPlayer(currentPlayer));

// a map of symbols for display on board 
const playerSymbols = {
  [Players.BLANK]: " ",
  [Players.X]: "X",
  [Players.O]: "O",
};

// dropdown select parser for difficulty callback function
function depthLimit(selectionID = "difficulty") {
  const depthSelect = document.getElementById(selectionID);
  const depth = depthSelect.options[depthSelect.selectedIndex].value;
  // parse depthlimit and create new agen with depth limit
  agent = new TicTacToeAgent(
    nextPlayer(currentPlayer),
    depth === "inf" ? Number.MAX_VALUE : depth
  );
}

// size toggele to switch between 3x3 and 4x4 boards
function toggleSize(buttonID = "size-toggle") {
  const button = document.getElementById(buttonID);
  // change button text and render new
  if (BOARD_SIZE === 4) {
    button.innerText = "Play 4 x 4";
    BOARD_SIZE = 3;
    renderBoard();
  } else {
    button.innerText = "Play 3 x 3";
    BOARD_SIZE = 4;
    renderBoard();
  }
}

// toggles human v. human and human v. AI
function toggleAI(buttonID = "ai-toggle") {
  const button = document.getElementById(buttonID);
  if (playWithAgent) button.innerText = "Play against Human vs. AI";
  else button.innerText = "Play Human vs. Human";
  playWithAgent = !playWithAgent;
}

// helper function for status display with colors for success/ failure
function displayMessage(message, success = true, messageBoxId = "status") {
  const messageBox = document.getElementById(messageBoxId);
  messageBox.style = success ? "color:green;" : "color:red;";
  messageBox.innerText = message;
}

// renders a move onto the board
function renderMove(row, col, player) {
  const cell = document.getElementById(`${row},${col}`);
  cell.innerText = playerSymbols[player];
}

// callback for a click on the board
function onClickCell(e) {
  // find the cell that was clicked
  const clickedCell = e.target;
  // if clicked cell is not already played
  if (clickedCell.innerText === "") {
    // set the clicked cell to be current players tag
    clickedCell.innerText = playerSymbols[currentPlayer];
    // add the same move to board object
    ticTacToeBoard.addMove(
      clickedCell.getAttribute("row"),
      clickedCell.getAttribute("col"),
      currentPlayer
    );
    // determine if it was a winningplay
    let winner = ticTacToeBoard.getWinner();
    // determine if draw/ any moves left
    let playable = ticTacToeBoard.isPlayable();
    // if it was a winning play, display winner 
    if (winner) displayMessage(`${playerSymbols[winner]} has won!`);
    // if not winner and not playable, it's a draw
    else if (!playable) displayMessage(`It's a draw!`);
    // check if playing with agent 
    else if (playWithAgent) {
      // agent move
      currentPlayer = nextPlayer(currentPlayer);
      // ask agent for best move
      let [row, col] = agent.getBestMove(ticTacToeBoard);
      // play the best move
      ticTacToeBoard.addMove(row, col, currentPlayer);
      renderMove(row, col, currentPlayer);
      displayMessage("");
      // check for winner/draw
      let winner = ticTacToeBoard.getWinner();
      let playable = ticTacToeBoard.isPlayable();
      if (winner) displayMessage(`${playerSymbols[winner]} has won!`);
      else if (!playable) displayMessage(`It's a draw!`);
    }
    currentPlayer = nextPlayer(currentPlayer);
  }
}

// init function to render a new board with a board object
function renderBoard() {
  // init vars
  ticTacToeBoard = new TicTacToeBoard();
  depthLimit();
  displayMessage("");
  currentPlayer = Players.X;
  const board = document.getElementById("board");
  // remove all cells
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  // recreate new board
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < BOARD_SIZE; j++) {
      let cell = document.createElement("td");
      // add row, col attr to query later
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);
      cell.id = `${i},${j}`;
      // hook funtion
      cell.addEventListener("click", onClickCell);
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

renderBoard();
