var currentPlayer = BoardCell.O;
var stateBoard = new TicTacToeBoard();

function onClickCell(e) {
  const clickedCell = e.target;
  if (clickedCell.innerText === "") {
    clickedCell.innerText = currentPlayer;
    stateBoard.addMove(
      clickedCell.getAttribute("row"),
      clickedCell.getAttribute("col"),
      currentPlayer
    );
    console.log(stateBoard.state);
    let winner = stateBoard.isEnd();
    if (winner) alert(`${winner} has won!`);
    currentPlayer = currentPlayer === BoardCell.X ? BoardCell.O : BoardCell.X;
  }
}

function renderBoard() {
  stateBoard = new TicTacToeBoard();
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
