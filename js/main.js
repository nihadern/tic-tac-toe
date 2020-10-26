var currentPlayer = Players.O;
var ticTacToeBoard = new TicTacToeBoard();
var playWithAgent = true;
var agent = new TicTacToeAgent(nextPlayer(currentPlayer));

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
    if (winner) displayMessage(`${winner} has won!`);
    else if (playWithAgent) {
      currentPlayer = nextPlayer(currentPlayer);
      const [row, col] = agent.getBestMove(ticTacToeBoard);
      ticTacToeBoard.addMove(row, col, currentPlayer);
      renderMove(row, col, currentPlayer);
      let winner = ticTacToeBoard.getWinner();
      if (winner) displayMessage(`${winner} has won!`);
      currentPlayer = nextPlayer(currentPlayer);
    }
  }
}

function renderBoard() {
  ticTacToeBoard = new TicTacToeBoard();
  displayMessage("");
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
