var currentPlayer = Players.X;
var ticTacToeBoard = new TicTacToeBoard();
var playWithAgent = true;
var agent = new TicTacToeAgent(nextPlayer(currentPlayer));
const playerSymbols = {
  [Players.BLANK]: " ",
  [Players.X]: "X",
  [Players.O]: "O",
};

function depthLimit(selectionID = "difficulty") {
  const depthSelect = document.getElementById(selectionID);
  const depth = depthSelect.options[depthSelect.selectedIndex].value;
  agent = new TicTacToeAgent(
    nextPlayer(currentPlayer),
    depth === "inf" ? Number.MAX_VALUE : depth
  );
}

function toggleSize(buttonID = "size-toggle") {
  const button = document.getElementById(buttonID);
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

function toggleAI(buttonID = "ai-toggle") {
  const button = document.getElementById(buttonID);
  if (playWithAgent) button.innerText = "Play against Human vs. AI";
  else button.innerText = "Play Human vs. Human";
  playWithAgent = !playWithAgent;
}

function displayMessage(message, success = true, messageBoxId = "status") {
  const messageBox = document.getElementById(messageBoxId);
  messageBox.style = success ? "color:green;" : "color:red;";
  messageBox.innerText = message;
}

function renderMove(row, col, player) {
  const cell = document.getElementById(`${row},${col}`);
  cell.innerText = playerSymbols[player];
}

function onClickCell(e) {
  const clickedCell = e.target;
  if (clickedCell.innerText === "") {
    clickedCell.innerText = playerSymbols[currentPlayer];
    ticTacToeBoard.addMove(
      clickedCell.getAttribute("row"),
      clickedCell.getAttribute("col"),
      currentPlayer
    );
    let winner = ticTacToeBoard.getWinner();
    let playable = ticTacToeBoard.isPlayable();
    if (winner) displayMessage(`${playerSymbols[winner]} has won!`);
    else if (!playable) displayMessage(`It's a draw!`);
    else if (playWithAgent) {
      currentPlayer = nextPlayer(currentPlayer);
      let [row, col] = agent.getBestMove(ticTacToeBoard);
      ticTacToeBoard.addMove(row, col, currentPlayer);
      renderMove(row, col, currentPlayer);
      displayMessage("");
      let winner = ticTacToeBoard.getWinner();
      let playable = ticTacToeBoard.isPlayable();
      if (winner) displayMessage(`${playerSymbols[winner]} has won!`);
      else if (!playable) displayMessage(`It's a draw!`);
    }
    currentPlayer = nextPlayer(currentPlayer);
  }
}

function renderBoard() {
  ticTacToeBoard = new TicTacToeBoard();
  depthLimit();
  displayMessage("");
  currentPlayer = Players.X;
  const board = document.getElementById("board");
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  for (let i = 0; i < BOARD_SIZE; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < BOARD_SIZE; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("row", i);
      cell.setAttribute("col", j);
      cell.id = `${i},${j}`;
      cell.addEventListener("click", onClickCell);
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}

renderBoard();
