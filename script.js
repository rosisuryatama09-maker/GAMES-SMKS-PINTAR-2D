// ==========================================
// BLOCK BLAST 17 - GAME.JS
// ==========================================

// KONFIGURASI
const boardSize = 8;

const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwjfW_p1dHi0P-FesLQj22Ln2tl1abLZoUtIFdAgzrLaDxgvnESwQYV3Pb_EPOwLc1s/exec";

let board = [];
let score = 0;
let highScore = Number(
  localStorage.getItem("blockBlastHighScore")
) || 0;

let selectedBlock = null;
let currentBlocks = [];
let combo = 0;


// ==========================================
// KOLEKSI BENTUK PUZZLE
// ==========================================

const blockShapes = [

  // 1 Block
  [[1]],

  // Garis horizontal
  [[1, 1]],
  [[1, 1, 1]],
  [[1, 1, 1, 1]],
  [[1, 1, 1, 1, 1]],

  // Garis vertikal
  [
    [1],
    [1]
  ],

  [
    [1],
    [1],
    [1]
  ],

  [
    [1],
    [1],
    [1],
    [1]
  ],

  [
    [1],
    [1],
    [1],
    [1],
    [1]
  ],

  // Kotak 2x2
  [
    [1, 1],
    [1, 1]
  ],

  // Kotak 3x3
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ],

  // L kecil
  [
    [1, 0],
    [1, 1]
  ],

  // L terbalik
  [
    [0, 1],
    [1, 1]
  ],

  // L besar
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],

  // L besar terbalik
  [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1]
  ],

  // T
  [
    [1, 1, 1],
    [0, 1, 0]
  ],

  // T terbalik
  [
    [0, 1, 0],
    [1, 1, 1]
  ],

  // T vertikal
  [
    [1, 0],
    [1, 1],
    [1, 0]
  ],

  // Z
  [
    [1, 1, 0],
    [0, 1, 1]
  ],

  // S
  [
    [0, 1, 1],
    [1, 1, 0]
  ],

  // Sudut
  [
    [1, 1],
    [1, 0]
  ],

  [
    [1, 0],
    [1, 1]
  ],

  // Plus
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],

  // Bentuk tangga
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
  ]
];


// ==========================================
// WARNA BLOCK
// ==========================================

const blockColors = [
  "#38bdf8",
  "#f43f5e",
  "#a855f7",
  "#22c55e",
  "#facc15",
  "#fb923c",
  "#06b6d4"
];


// ==========================================
// MEMULAI GAME
// ==========================================

function initGame() {

  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  score = 0;
  combo = 0;
  selectedBlock = null;
  currentBlocks = [];

  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText =
    highScore;

  renderBoard();

  generateBlocks();
}


// ==========================================
// MENAMPILKAN BOARD
// ==========================================

function renderBoard() {

  const gameBoard =
    document.getElementById("gameBoard");

  gameBoard.innerHTML = "";

  for (let row = 0; row < boardSize; row++) {

    for (let col = 0; col < boardSize; col++) {

      const cell = document.createElement("div");

      cell.classList.add("cell");

      if (board[row][col]) {

        cell.classList.add("filled");

        cell.style.background =
          board[row][col];

      }

      cell.addEventListener("click", () => {

        placeBlock(row, col);

      });

      gameBoard.appendChild(cell);
    }
  }
}


// ==========================================
// MEMBUAT 3 BLOCK ACAK
// ==========================================

function generateBlocks() {

  currentBlocks = [];

  const container =
    document.getElementById("blocksContainer");

  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {

    const randomShape =
      blockShapes[
        Math.floor(
          Math.random() *
          blockShapes.length
        )
      ];

    const randomColor =
      blockColors[
        Math.floor(
          Math.random() *
          blockColors.length
        )
      ];

    const blockData = {
      shape: randomShape,
      color: randomColor,
      used: false
    };

    currentBlocks.push(blockData);

    createBlock(blockData, i);
  }
}


// ==========================================
// MEMBUAT TAMPILAN BLOCK
// ==========================================

function createBlock(blockData, index) {

  const container =
    document.getElementById("blocksContainer");

  const block =
    document.createElement("div");

  block.classList.add("block");

  const shape = blockData.shape;

  const rows = shape.length;
  const cols = shape[0].length;

  block.style.gridTemplateColumns =
    `repeat(${cols}, 20px)`;

  block.style.gridTemplateRows =
    `repeat(${rows}, 20px)`;


  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      const cell =
        document.createElement("div");

      if (shape[row][col] === 1) {

        cell.classList.add("block-cell");

        cell.style.background =
          blockData.color;

      } else {

        cell.style.width = "20px";
        cell.style.height = "20px";
        cell.style.background = "transparent";

      }

      block.appendChild(cell);
    }
  }


  // Pilih block

  block.addEventListener("click", () => {

    document
      .querySelectorAll(".block")
      .forEach(item => {

        item.classList.remove("selected");

      });


    block.classList.add("selected");


    selectedBlock = {
      ...blockData,
      index: index,
      element: block
    };

  });


  container.appendChild(block);
}


// ==========================================
// MEMASANG BLOCK KE BOARD
// ==========================================

function placeBlock(startRow, startCol) {

  if (!selectedBlock) {

    showMessage("Pilih block terlebih dahulu!");

    return;
  }


  const shape =
    selectedBlock.shape;


  if (!canPlace(
    shape,
    startRow,
    startCol
  )) {

    showMessage(
      "Block tidak bisa dipasang di posisi ini!"
    );

    return;
  }


  let placedCells = 0;


  // Pasang block

  for (let row = 0; row < shape.length; row++) {

    for (
      let col = 0;
      col < shape[row].length;
      col++
    ) {

      if (shape[row][col] === 1) {

        board[startRow + row]
          [startCol + col] =
            selectedBlock.color;

        placedCells++;

      }
    }
  }


  // Tambah skor

  score += placedCells * 10;


  // Hapus block yang sudah digunakan

  currentBlocks[
    selectedBlock.index
  ].used = true;


  selectedBlock.element.remove();


  selectedBlock = null;


  // Cek garis penuh

  const clearedLines =
    clearLines();


  // Sistem combo

  if (clearedLines > 0) {

    combo++;

    const bonus =
      clearedLines * 100 * combo;

    score += bonus;

    showMessage(
      `🔥 COMBO x${combo}! +${bonus}`
    );

  } else {

    combo = 0;

  }


  updateScore();

  renderBoard();


  // Jika semua block habis

  const remainingBlocks =
    currentBlocks.filter(
      block => !block.used
    );


  if (remainingBlocks.length === 0) {

    setTimeout(() => {

      generateBlocks();

      checkGameOver();

    }, 300);

  } else {

    checkGameOver();

  }
}


// ==========================================
// CEK APAKAH BLOCK BISA DIPASANG
// ==========================================

function canPlace(
  shape,
  startRow,
  startCol
) {

  for (
    let row = 0;
    row < shape.length;
    row++
  ) {

    for (
      let col = 0;
      col < shape[row].length;
      col++
    ) {

      if (shape[row][col] === 1) {

        const newRow =
          startRow + row;

        const newCol =
          startCol + col;


        // Keluar board

        if (
          newRow >= boardSize ||
          newCol >= boardSize
        ) {

          return false;

        }


        // Sudah terisi

        if (
          board[newRow][newCol] !== null
        ) {

          return false;

        }

      }
    }
  }

  return true;
}


// ==========================================
// MENGHAPUS BARIS DAN KOLOM PENUH
// ==========================================

function clearLines() {

  let cleared = 0;

  let rowsToClear = [];
  let colsToClear = [];


  // Cek baris

  for (
    let row = 0;
    row < boardSize;
    row++
  ) {

    if (
      board[row].every(
        cell => cell !== null
      )
    ) {

      rowsToClear.push(row);

    }
  }


  // Cek kolom

  for (
    let col = 0;
    col < boardSize;
    col++
  ) {

    let full = true;


    for (
      let row = 0;
      row < boardSize;
      row++
    ) {

      if (board[row][col] === null) {

        full = false;

        break;

      }
    }


    if (full) {

      colsToClear.push(col);

    }
  }


  // Hapus baris

  rowsToClear.forEach(row => {

    for (
      let col = 0;
      col < boardSize;
      col++
    ) {

      board[row][col] = null;

    }

    cleared++;

  });


  // Hapus kolom

  colsToClear.forEach(col => {

    for (
      let row = 0;
      row < boardSize;
      row++
    ) {

      board[row][col] = null;

    }

    cleared++;

  });


  return cleared;
}


// ==========================================
// UPDATE SKOR
// ==========================================

function updateScore() {

  document.getElementById("score")
    .innerText = score;


  if (score > highScore) {

    highScore = score;

    localStorage.setItem(
      "blockBlastHighScore",
      highScore
    );

    document.getElementById("highScore")
      .innerText = highScore;

  }
}


// ==========================================
// CEK GAME OVER
// ==========================================

function checkGameOver() {

  const availableBlocks =
    currentBlocks.filter(
      block => !block.used
    );


  if (availableBlocks.length === 0) {

    return;

  }


  let hasMove = false;


  for (
    const block of availableBlocks
  ) {

    if (canPlaceAnywhere(block.shape)) {

      hasMove = true;

      break;

    }
  }


  if (!hasMove) {

    setTimeout(() => {

      gameOver();

    }, 300);

  }
}


// ==========================================
// CEK BLOCK BISA DIPASANG DIMANAPUN
// ==========================================

function canPlaceAnywhere(shape) {

  for (
    let row = 0;
    row < boardSize;
    row++
  ) {

    for (
      let col = 0;
      col < boardSize;
      col++
    ) {

      if (
        canPlace(shape, row, col)
      ) {

        return true;

      }
    }
  }

  return false;
}


// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

  alert(
    "🎮 GAME OVER!\n\n" +
    "Skor kamu: " +
    score +
    "\n\nMasukkan nama untuk leaderboard!"
  );

}


// ==========================================
// RESTART GAME
// ==========================================

function restartGame() {

  if (
    confirm(
      "Yakin ingin memulai ulang permainan?"
    )
  ) {

    initGame();

  }
}


// ==========================================
// PESAN DI LAYAR
// ==========================================

function showMessage(message) {

  const oldMessage =
    document.getElementById("gameMessage");


  if (oldMessage) {

    oldMessage.remove();

  }


  const messageBox =
    document.createElement("div");

  messageBox.id = "gameMessage";

  messageBox.innerText = message;


  messageBox.style.position = "fixed";
  messageBox.style.top = "20px";
  messageBox.style.left = "50%";
  messageBox.style.transform =
    "translateX(-50%)";

  messageBox.style.background =
    "#facc15";

  messageBox.style.color =
    "#111827";

  messageBox.style.padding =
    "12px 25px";

  messageBox.style.borderRadius =
    "10px";

  messageBox.style.fontWeight =
    "bold";

  messageBox.style.zIndex =
    "999";


  document.body.appendChild(
    messageBox
  );


  setTimeout(() => {

    messageBox.remove();

  }, 2000);

}


// ==========================================
// KIRIM SKOR KE GOOGLE SHEETS
// ==========================================

async function submitScore() {

  const nameInput =
    document.getElementById("playerName");

  const name =
    nameInput.value.trim();


  if (!name) {

    alert(
      "Masukkan nama pemain terlebih dahulu!"
    );

    return;

  }


  if (
    GOOGLE_SCRIPT_URL ===
    "ISI_URL_GOOGLE_APPS_SCRIPT_KAMU"
  ) {

    alert(
      "Masukkan URL Google Apps Script terlebih dahulu!"
    );

    return;

  }


  try {

    await fetch(
      GOOGLE_SCRIPT_URL,
      {

        method: "POST",

        mode: "no-c
