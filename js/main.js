var currentPlayer = BoardCell.O;
var ticTacToeBoard = new TicTacToeBoard();

function displayMessage(message, success = true, messageBoxId = "status") {
  const messageBox = document.getElementById(messageBoxId);
  messageBox.style = success ? "color:green;" : "color:red;";
  messageBox.innerText = message;
}

function onClickCell(e) {
  const clickedCell = e.target;
  if (clickedCell.innerText === "") {
    clickedCell.innerText = currentPlayer;
    ticTacToeBoard.addMove(
      clickedCell.getAttribute("row"),
      clickedCell.getAttribute("col"),
      currentPlayer
    );
    console.log(ticTacToeBoard.state);
    let winner = ticTacToeBoard.getWinner();
    if (winner) displayMessage(`${winner} has won!`);
    currentPlayer = currentPlayer === BoardCell.X ? BoardCell.O : BoardCell.X;
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
