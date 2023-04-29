var board;
const boardContainer = document.querySelector(".game-container");
const levelSelect = document.querySelector(".level-select");
const maxNumber = document.querySelector(".max-number");
const curNumber = document.querySelector(".cur-number");
let score = 0;
const stopBotBtn = document.querySelector(".stop-bot-btn");
const botActive = document.querySelector(".bot-active-icon");
const loseModal = document.querySelector(".lose-modal");
let heisActive = false;
const maxTime = document.querySelector(".max-time");
let globalMax = 0;
window.onload = function () {
  startGame();
};

const checkLevel = (e) => {
  let level = levelSelect.value;
  if (level === "1") {
    createBoard(4);
    setLength(4);
  }
  if (level === "2") {
    createBoard(5);
    setLength(5);
  }
  if (level === "3") {
    createBoard(6);
    setLength(6);
  }
  if (level === "4") {
    createBoard(7);
    setLength(7);
  }
};
const setLength = (length) => {
  boardContainer.style.gridTemplateColumns = `repeat(${length}, 75px)`;
  boardContainer.style.gridTemplateRows = `repeat(${length}, 75px)`;
};
levelSelect.addEventListener("change", checkLevel);
function startGame() {
  createBoard(4);
  updateBoard(board);
}

document.onkeyup = (e) => {
  if (e.code == "ArrowLeft") {
    updateBoard(slideLeft(board));
  }
  if (e.code == "ArrowRight") {
    updateBoard(slideRight(board));
  }
  if (e.code == "ArrowUp") {
    updateBoard(slideUp(board));
  }
  if (e.code == "ArrowDown") {
    updateBoard(slideDown(board));
  }
};
// ===================================Helpers======================================

const filterZero = (row) => {
  return row.filter((number) => number !== 0);
};
const checkZeros = (board) => {
  let occurences = 0;
  for (const line of board) {
    for (const number of line) {
      if (number === 0) {
        occurences += 1;
      }
    }
  }
  return occurences;
};
const sumBoard = (board) => {
  let sum = 0;
  for (const line of board) {
    for (const number of line) {
      sum += number;
    }
  }
  return sum;
};

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const checkMax = () => {
  for (const line of board) {
    for (const number of line) {
      if (number > globalMax) {
        globalMax = number;
      }
    }
  }
  return globalMax;
};

const pushRow = (row) => {
  while (row.length < board.length) {
    row.push(0);
  }
  return row;
};
const unshiftRow = (row) => {
  while (row.length < board.length) {
    row.unshift(0);
  }
  return row;
};
// ==================================logic funcs====================================
const slide = (row) => {
  let zeroNoRow = filterZero(row);
  for (let i = 0; i < zeroNoRow.length - 1; i++) {
    if (zeroNoRow[i] == zeroNoRow[i + 1]) {
      zeroNoRow[i] *= 2;
      zeroNoRow[i + 1] = 0;
    }
  }
  return filterZero(zeroNoRow);
};

const slideLeft = (board) => {
  let newBoard = board;
  for (let i = 0; i < newBoard.length; i++) {
    let slidedRow = slide(newBoard[i]);
    slidedRow = pushRow(slidedRow);
    newBoard[i] = slidedRow;
  }
  return newBoard;
};

const slideRight = (board) => {
  let newBoard = board;
  for (let i = 0; i < newBoard.length; i++) {
    let slidedRow = slide(newBoard[i]);
    slidedRow = unshiftRow(slidedRow);
    newBoard[i] = slidedRow;
  }
  return newBoard;
};
const slideUp = (board) => {
  let newBoard = board;
  for (let i = 0; i < newBoard.length; i++) {
    let slidedRow = [];
    for (let g = 0; g < newBoard.length; g++) {
      slidedRow[g] = newBoard[g][i];
    }
    slidedRow = slide(slidedRow);
    slidedRow = pushRow(slidedRow);
    for (let g = 0; g < newBoard.length; g++) {
      newBoard[g][i] = slidedRow[g];
    }
  }
  return newBoard;
};
const slideDown = (board) => {
  let newBoard = board;
  for (let i = 0; i < newBoard.length; i++) {
    let slidedRow = [];
    for (let g = 0; g < newBoard.length; g++) {
      slidedRow[g] = newBoard[g][i];
    }
    slidedRow = slide(slidedRow);
    slidedRow = unshiftRow(slidedRow);
    for (let g = 0; g < newBoard.length; g++) {
      newBoard[g][i] = slidedRow[g];
    }
  }
  return newBoard;
};
const addNumber = () => {
  let emptyCors = [];
  for (let i = 0; i < board.length; i++) {
    for (let b = 0; b < board.length; b++) {
      if (board[i][b] == 0) {
        emptyCors.push([i, b]);
      }
    }
  }
  let randomNumber = getRandomNumber(0, emptyCors.length - 1);
  let randomNumber2 = getRandomNumber(1, 10);
  let number = 2;
  if (randomNumber2 > 7) {
    number = 4;
  }
  if (emptyCors.length > 0) {
    board[emptyCors[randomNumber][0]][emptyCors[randomNumber][1]] = number;
  }
};

const createBoard = (length) => {
  var newBoard = [];
  for (let b = 0; b < length; b++) {
    var row = [];
    for (let a = 0; a < length; a++) {
      row.push(0);
    }
    newBoard.push(row);
  }
  board = newBoard;
  updateBoard(newBoard);
};

const updateBoard = (board) => {
  addNumber();
  boardContainer.innerHTML = "";
  for (const line of board) {
    for (const number of line) {
      let number_container = document.createElement("div");
      number_container.innerHTML = number;
      number_container.className = `number-container x${number}`;
      number_container.classList.add("plusani");
      if (number > 2048) {
        number_container.className = `number-container x2048`;
      }
      boardContainer.append(number_container);
    }
  }
  let dif = sumBoard(board) - score;
  curNumber.innerHTML = `Score: ${score + dif}`;
  maxNumber.innerHTML = `Best: ${checkMax()}`;
  if (!hasMoves()) {
    loseModal.style.display = "flex";
  }
};

const hasMoves = () => {
  if (checkZeros(board)) {
    return true;
  }
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length - 1; col++) {
      if (board[row][col] === board[row][col + 1]) {
        return true;
      }
    }
  }
  for (let row = 0; row < board.length - 1; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === board[row + 1][col]) {
        return true;
      }
    }
  }
  return false;
};
loseModal.addEventListener("click", () => {
  checkLevel();
  loseModal.style.display = "none";
});
// ==============================Bot Functions=============================================
var moveInterval;
stopBotBtn.addEventListener("click", () => {
  clearInterval(moveInterval);
  stopBotBtn.innerHTML = "<p>Help, Bot!</p>";
  heisActive = false;
});
botActive.addEventListener("click", () => {
  stopBotBtn.innerHTML = "<p>Stop, Bot!</p>";
  if (!heisActive) {
    moveInterval = setInterval(() => {
      botMove();
    }, 100);
    heisActive = true;
  }
});
document.addEventListener("keydown", (event) => {
  // Check if the key pressed is the space key (keyCode 32)
  if (event.key === " ") {
    // Call the function
    botMove();
  }
});
let sum = 0;
const botMove = () => {
  if (!hasMoves()) {
    return;
  }
  var moveName = "";
  let zeroes = 0;
  let leftBoard = slideLeft(board);
  let rightBoard = slideRight(board);
  let upBoard = slideUp(board);
  let downBoard = slideDown(board);
  let leftSum = sumBoard(leftBoard);
  let rightSum = sumBoard(rightBoard);
  let upSum = sumBoard(upBoard);
  let downSum = sumBoard(downBoard);
  let leftZeroes = checkZeros(leftBoard);
  let rightZeroes = checkZeros(rightBoard);
  let upZeroes = checkZeros(upBoard);
  let downZeroes = checkZeros(downBoard);
  if (leftSum >= sum) {
    moveName = "Left";
    sum = leftSum;
  }
  if (downSum >= sum) {
    moveName = "Down";
    sum = downSum;
  }
  if (rightSum >= sum) {
    moveName = "Right";
    sum = rightSum;
  }

  if (upSum >= sum) {
    moveName = "Up";
    sum = upSum;
  }
  if (moveName === "Left") {
    updateBoard(leftBoard);
  }
  if (moveName === "Right") {
    updateBoard(rightBoard);
  }
  if (moveName === "Up") {
    updateBoard(upBoard);
  }
  if (moveName === "Down") {
    updateBoard(downBoard);
  }
};
