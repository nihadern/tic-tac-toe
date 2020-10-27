var currentPlayer = Players.X;
var ticTacToeBoard = new TicTacToeBoard();
var playWithAgent = true;
var agent = new TicTacToeAgent(nextPlayer(currentPlayer));
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
  cell.innerText = player;
}

function onClickCell(e) {
  const clickedCell = e.target;
  console.log("Player turn!");

  if (clickedCell.innerText === "") {
    clickedCell.innerText = currentPlayer;
    ticTacToeBoard.addMove(
      clickedCell.getAttribute("row"),
      clickedCell.getAttribute("col"),
      currentPlayer
    );
    let winner = ticTacToeBoard.getWinner();
    let playable = ticTacToeBoard.isPlayable();
    if (winner) displayMessage(`${winner} has won!`);
    else if (!playable) displayMessage(`It's a draw!`);
    else if (playWithAgent) {
      currentPlayer = nextPlayer(currentPlayer);
      const [row, col] = agent.getBestMove(ticTacToeBoard);
      ticTacToeBoard.addMove(row, col, currentPlayer);
      renderMove(row, col, currentPlayer);
      let winner = ticTacToeBoard.getWinner();
      if (winner) displayMessage(`${winner} has won!`);
    }
    currentPlayer = nextPlayer(currentPlayer);
  }
}

function renderBoard() {
  ticTacToeBoard = new TicTacToeBoard();
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
