import { generatePuzzle } from "./SudokuGenerator.js";

let solution;
let puzzle;
let maxMistakes;
let time;
const level = document.querySelector(".level");
const btn1 = document.createElement("button");
btn1.innerHTML = "Easy";
const btn2 = document.createElement("button");
btn2.innerHTML = "Medium";
const btn3 = document.createElement("button");
btn3.innerHTML = "Difficult";
level.appendChild(btn1);
level.appendChild(btn2);
level.appendChild(btn3);
btn1.addEventListener("click", displayEasy);
btn2.addEventListener("click", displayMedium);
btn3.addEventListener("click", displayHard);
function displayEasy() {
  ({ solution, puzzle } = generatePuzzle(30));
  maxMistakes = 5;
  time = 600;
  renderPuzzle(puzzle, solution);
}
function displayMedium() {
  ({ solution, puzzle } = generatePuzzle(40));
  maxMistakes = 8;
  time = 900;
  renderPuzzle(puzzle, solution);
}
function displayHard() {
  ({ solution, puzzle } = generatePuzzle(50));
  maxMistakes = 10;
  time = 1200;
  renderPuzzle(puzzle, solution);
}
const mistakecount = document.querySelector(".mistake-count");
let timerInterval;
let noofmistakes = 0;
function renderPuzzle(puzzle, answer) {
  const sudoku = document.querySelector(".sudoku-container");
  const subheading = document.querySelector(".subheading");
  const timer = document.querySelector(".timer");
  subheading.style.display = "none";
  level.style.display = "none";
  sudoku.classList.add("sudoku-container-show");
  sudoku.innerHTML = "";
  mistakecount.classList.add("mistake-count-show");
  mistakecount.innerHTML = "No of mistakes:0";
  timerInterval = setInterval(() => {
    if (time > 0) {
      timer.innerHTML = formatTime(time);
      if (time < 120) timer.style.color = "red";
      else timer.style.color = "green";
    } else {
      timer.innerHTML = "00:00s";
      timer.style.color = "red";
      clearInterval(timerInterval);
      disableAllCells();
      showGameEndMessage("Time's up! Try again.", "red");
    }
    time--;
  }, 1000);
  let currentBoard = JSON.parse(JSON.stringify(puzzle));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      cell.classList.add("cell");

      if (puzzle[r][c] !== 0) {
        cell.value = puzzle[r][c];
        cell.disabled = true;
        cell.classList.add("prefilled");
      } else {
        cell.addEventListener("input", (e) => {
          const val = parseInt(e.target.value);
          if (val >= 1 && val <= 9) {
            if (val === solution[r][c]) {
              e.target.style.backgroundColor = "lightgreen";
              currentBoard[r][c] = val;
              checkForWin(currentBoard, solution);
            } else {
              e.target.style.backgroundColor = "salmon";
              noofmistakes++;

              updateMessage();
              if (noofmistakes >= maxMistakes) {
                clearInterval(timerInterval);
                disableAllCells();
                showGameEndMessage(
                  "Game Over! You made out of mistakes.",
                  "red"
                );
                return;
              }
              setTimeout(() => {
                e.target.style.backgroundColor = "";
                e.target.value = "";
              }, 500);
            }
          } else {
            showTooltip(e.target, "Only digits 1–9 allowed");
            e.target.value = "";
          }
        });
      }
      sudoku.appendChild(cell);
    }
  }
}
function showTooltip(element, message) {
  const tip = document.querySelector(".tooltip");
  tip.textContent = message;
  tip.style.display = "block";
  setTimeout(() => {
    tip.style.display = "none";
  }, 2000);
}
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  let minStr = mins;
  let secStr = secs;
  if (mins < 10) minStr = "0" + mins;
  if (secs < 10) secStr = "0" + secs;
  return "Time: " + minStr + ":" + secStr + "s" + "🕒";
}
function updateMessage() {
  mistakecount.innerHTML = "No of mistakes: " + noofmistakes;
}
function disableAllCells() {
  const allCells = document.querySelectorAll(".cell");
  allCells.forEach((cell) => {
    if (!cell.disabled) {
      cell.disabled = true;
      cell.style.backgroundColor = "#ccc";
    }
  });
  clearInterval(timerInterval);
}
function checkForWin(currentBoard, solution) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (
        currentBoard[row][col] === "" ||
        currentBoard[row][col].toString() !== solution[row][col].toString()
      ) {
        return false;
      }
    }
  }
  showGameEndMessage("Congratulations! You Won!", "green");
  return true;
}
function showGameEndMessage(text, color) {
  const modal = document.getElementById("gameModal");
  const message = document.getElementById("modalMessage");
  message.textContent = text;
  message.style.color = color;
  modal.classList.add("show");
  clearInterval(timerInterval);
  document.querySelector(".replay").addEventListener("click", () => {
    const modal = document.getElementById("gameModal");
    modal.classList.remove("show");
    location.reload();
  });
}
