function sudokuGenerator() {
  let a = Array.from({ length: 9 }, () => Array(9).fill(0));
  while (!fillSudoku(a)) {
    a = Array.from({ length: 9 }, () => Array(9).fill(0));
  }
  return a;
}
function fillSudoku(a) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (a[row][col] === 0) {
        let numbers = getShuffledNumbers();
        for (let num of numbers) {
          if (canPlace(num, row, col, a)) {
            a[row][col] = num;
            if (fillSudoku(a)) return true;
            a[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
function canPlace(num, row, col, a) {
  for (let i = 0; i < 9; i++) {
    if (a[row][i] === num || a[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (a[i][j] === num) return false;
    }
  }
  return true;
}
function getShuffledNumbers() {
  const nums = Array.from({ length: 9 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function getShuffledPositions() {
  const positions = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions;
}
function countSolutions(board) {
  let cnt = 0;
  function solve(a) {
    if (cnt > 1) return;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (a[i][j] == 0) {
          for (let x = 1; x <= 9; x++) {
            if (canPlace(x, i, j, a)) {
              a[i][j] = x;
              solve(a);
            }
          }
          a[i][j] = 0;
          return;
        }
      }
    }
    cnt++;
  }
  solve(board.map((row) => row.slice()));
  return cnt;
}
export function generatePuzzle(emptyCells) {
  const solution = sudokuGenerator();
  const puzzle = solution.map((row) => row.slice());
  const positions = getShuffledPositions();
  let removed = 0;
  for (let i = 0; i < positions.length && removed < emptyCells; i++) {
    const [r, c] = positions[i];
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    let num = countSolutions(puzzle);
    if (num == 1) removed++;
    else puzzle[r][c] = backup;
  }
  return { solution, puzzle };
}
