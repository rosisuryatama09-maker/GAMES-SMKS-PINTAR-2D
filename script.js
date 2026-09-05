const boardSize = 8;

let board = [];
let score = 0;
let highScore = localStorage.getItem("blockBlastHighScore") || 0;

let selectedBlock = null;

const blockShapes = [

  [[1]],

  [[1, 1]],

  [
    [1],
    [1]
  ],

  [
    [1, 1],
    [1, 1]
  ],

  [[1, 1, 1]],

  [
    [1],
    [1],
    [1]
  ],

  [
    [1, 0],
    [1, 1]
  ],

  [
    [1, 1],
    [0, 1]
  ],

  [
    [1, 1, 1],
    [0, 1, 0]
  ]
];


function initGame() {

  board = Array(boardSize)
    .fill()
    .map(() => Array(boardSize).fill(0));

  score = 0;

  document.getElementById("score").innerText = score;

  document.getElementById("highScore").innerText = highScore;

  renderBoard();

  generateBlocks();
}


function renderBoard() {

  const gameBoard = document.getElementById("gameBoard");

  gameBoard.innerHTML = "";

  for (let row = 0; row < boardSize; row++) {

    for (let col = 0; col < boardSize; col++) {

      const cell = document.createElement("div");

      cell.classList.add("cell");

      if (board[row][col] === 1) {
        cell.classList.add("filled");
      }

      cell.addEventListener("click", () => {
        placeBlock(row, col);
      });

      gameBoard.appendChild(cell);
    }
  }
}


function generateBlocks() {

  const container =
    document.getElementById("blocksContainer");

  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {

    const shape =
      blockShapes[
        Math.floor(Math.random() * blockShapes.length)
      ];

    createBlock(shape);
  }
}


function createBlock(shape) {

  const block = document.createElement("div");

  block.classList.add("block");

  const rows = shape.length;
  const cols = shape[0].length;

  block.style.gridTemplateColumns =
    `repeat(${cols}, 20px)`;

  block.style.gridTemplateRows =
    `repeat(${rows}, 20px)`;


  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      const cell = document.createElement("div");

      if (shape[row][col] === 1) {

        cell.classList.add("block-cell");

      } else {

        cell.style.width = "20px";
        cell.style.height = "20px";

      }

      block.appendChild(cell);
    }
  }


  block.addEventListener("click", () => {

    document
      .querySelectorAll(".block")
      .forEach(b => b.classList.remove("selected"));

    block.classList.add("selected");

    selectedBlock = {
      shape: shape,
      element: block
    };

  });


  container.appendChild(block);
}


function placeBlock(startRow, startCol) {

  if (!selectedBlock) {
    return;
  }

  const shape = selectedBlock.shape;


  if (!canPlace(shape, startRow, startCol)) {

    alert("Block tidak bisa dipasang di sini!");

    return;
  }


  for (let row = 0; row < shape.length; row++) {

    for (let col = 0; col < shape[row].length; col++) {

      if (shape[row][col] === 1) {

        board[startRow + row][startCol + col] = 1;

        score += 10;

      }
    }
  }


  selectedBlock.element.remove();

  selectedBlock = null;


  clearLines();

  updateScore();

  renderBoard();


  const remainingBlocks =
    document.querySelectorAll(".block");

  if (remainingBlocks.length === 0) {

    generateBlocks();

  }


  checkGameOver();
}


function canPlace(shape, startRow, startCol) {

  for (let row = 0; row < shape.length; row++) {

    for (let col = 0; col < shape[row].length; col++) {

      if (shape[row][col] === 1) {

        const newRow = startRow + row;
        const newCol = startCol + col;


        if (
          newRow >= boardSize ||
          newCol >= boardSize
        ) {
          return false;
        }


        if (board[newRow][newCol] === 1) {
          return false;
        }

      }
    }
  }

  return true;
}


function clearLines() {

  let cleared = 0;


  // Cek baris

  for (let row = 0; row < boardSize; row++) {

    if (board[row].every(cell => cell === 1)) {

      board[row].fill(0);

      cleared++;

    }
  }


  // Cek kolom

  for (let col = 0; col < boardSize; col++) {

    let full = true;

    for (let row = 0; row < boardSize; row++) {

      if (board[row][col] === 0) {

        full = false;

        break;

      }
    }


    if (full) {

      for (let row = 0; row < boardSize; row++) {

        board[row][col] = 0;

      }

      cleared++;

    }
  }


  if (cleared > 0) {

    score += cleared * 100;

  }
}


function updateScore() {

  document.getElementById("score").innerText = score;


  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "blockBlastHighScore",
      highScore
    );

    document.getElementById("highScore").innerText =
      highScore;
  }
}


function checkGameOver() {

  const blocks =
    document.querySelectorAll(".block");

  let possibleMove = false;


  blocks.forEach(blockElement => {

    // Data shape belum disimpan di element,
    // maka pengecekan dilakukan sederhana
    possibleMove = true;

  });


  if (!possibleMove && blocks.length === 0) {

    generateBlocks();

  }
}


function restartGame() {

  initGame();

}


initGame();
