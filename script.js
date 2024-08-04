let timer;
let startTime;
const gridElement = document.getElementById("sudoku-grid");
const validateButton = document.getElementById("validate-button");
const timerElement = document.getElementById("timer");
const scoreCard = document.getElementById("score-card");
const scoreElement = document.getElementById("score");
const playAgainButton = document.getElementById("play-again-button");

function generateSudoku() {
  function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (
        board[row][x] === num ||
        board[x][col] === num ||
        board[3 * Math.floor(row / 3) + Math.floor(x / 3)][
          3 * Math.floor(col / 3) + (x % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  }

  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              } else {
                board[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  let board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board);

  const solution = board.map((row) => [...row]);

  let cellsToRemove = 51;
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      cellsToRemove--;
    }
  }
  return { board, solution };
}

function createGrid(board) {
  gridElement.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("input");
      cell.type = "numeric";
      cell.maxLength = 1;
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (board[row][col] !== 0) {
        cell.value = board[row][col];
        cell.disabled = true;
      } else {
        cell.addEventListener("input", startTimer);
      }
      gridElement.appendChild(cell);
    }
  }
}

function startTimer() {
  if (!timer) {
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  const currentTime = new Date();
  const timeElapsed = Math.floor((currentTime - startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerElement.textContent = `Time: ${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function validateGrid(solution) {
  clearInterval(timer);
  timer = null;
  let correctCount = -30;
  let filledCount = 0;
  const inputs = gridElement.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.value) {
      const row = input.dataset.row;
      const col = input.dataset.col;
      if (parseInt(input.value) === solution[row][col]) {
        correctCount++;
      }
      filledCount++;
    }
  });
  scoreElement.textContent = `You got ${correctCount} out of ${51} cells correct!`;
}

validateButton.addEventListener("click", () =>
  validateGrid(currentPuzzle.solution)
);
playAgainButton.addEventListener("click", () => {
  const { board, solution } = generateSudoku();
  currentPuzzle = { board, solution };
  createGrid(board);
  timerElement.textContent = "Time: 0:00";
});

let currentPuzzle = generateSudoku();
createGrid(currentPuzzle.board);
