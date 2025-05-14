const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameOver = false;

function getBoardState() {
  return [...cells].map(cell => cell.textContent);
}

function checkWinnerFromBoard(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (let [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.every(cell => cell !== '') ? 'Draw' : null;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinnerFromBoard(board);
  if (winner === 'X') return -10 + depth;
  if (winner === 'O') return 10 - depth;
  if (winner === 'Draw') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function bestMove() {
  const board = getBoardState();
  let bestScore = -Infinity;
  let moveIndex = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        moveIndex = i;
      }
    }
  }

  if (moveIndex !== null) {
    const cell = cells[moveIndex];
    cell.textContent = 'O';
    cell.style.color = 'black';
    cell.classList.add('filled');
  }
}

function checkWinner() {
  return checkWinnerFromBoard(getBoardState());
}

function resetGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('filled');
  });
  currentPlayer = 'X';
  gameOver = false;
}

function displayGameResult(message) {
  const resultMessage = document.createElement('p');
  resultMessage.textContent = message;
  document.body.appendChild(resultMessage);
  setTimeout(() => {
    resultMessage.remove();  // Remove result message after 2 seconds
  }, 2000);
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (gameOver || cell.classList.contains('filled') || currentPlayer !== 'X') return;

    cell.textContent = 'X';
    cell.style.color = 'black';
    cell.classList.add('filled');

    let winner = checkWinner();
    if (winner) {
      const message = winner === 'Draw' ? 'It\'s a draw!' : `${winner} wins!`;
      displayGameResult(message);
      gameOver = true;
      setTimeout(resetGame, 2500);  // Wait for 2.5 seconds before resetting
      return;
    }

    currentPlayer = 'O';
    setTimeout(() => {
      bestMove();
      winner = checkWinner();
      if (winner) {
        const message = winner === 'Draw' ? 'It\'s a draw!' : `${winner} wins!`;
        displayGameResult(message);
        gameOver = true;
        setTimeout(resetGame, 2500);  // Wait for 2.5 seconds before resetting
        return;
      }
      currentPlayer = 'X';
    }, 500);
  });
});
