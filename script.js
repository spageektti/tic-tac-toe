const cells = document.querySelectorAll('[data-cell]');
const statusMessageElement = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
let currentPlayer = 'X';
let isGameActive = true;
let isAgainstAI = false;
let aiDifficulty = null; // 'easy', 'medium', or 'hard'

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(e) {
    const cell = e.target;
    if (cell.textContent !== '' || !isGameActive) return;

    makeMove(cell);

    if (isAgainstAI && isGameActive) {
        setTimeout(() => {
            if (aiDifficulty === 'easy') {
                easyAIMove();
            } else if (aiDifficulty === 'medium') {
                mediumAIMove();
            } else if (aiDifficulty === 'hard') {
                hardAIMove();
            }
        }, 500); 
    }
}

function makeMove(cell) {
    cell.textContent = currentPlayer;
    cell.classList.add(`player${currentPlayer}`);
    
    if (checkWin()) {
        statusMessageElement.textContent = `Player ${currentPlayer} wins! 🎉`;
        statusMessageElement.classList.add('win-message');
        statusMessageElement.classList.remove('draw-message');
        isGameActive = false;
    } else if (checkDraw()) {
        statusMessageElement.textContent = "It's a draw! 🤝";
        statusMessageElement.classList.add('draw-message');
        statusMessageElement.classList.remove('win-message');
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessageElement.textContent = `Player ${currentPlayer}'s turn`;
        statusMessageElement.classList.remove('win-message', 'draw-message');
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
}

function checkDraw() {
    return Array.from(cells).every(cell => {
        return cell.textContent !== '';
    });
}

function easyAIMove() {
    let availableCells = Array.from(cells).filter(cell => cell.textContent === '');
    if (availableCells.length === 0) return;
    
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomCell);
}

function mediumAIMove() {
    let move = findBestMove(currentPlayer);
    if (move !== null) {
        makeMove(cells[move]);
        return;
    }

    let opponent = currentPlayer === 'X' ? 'O' : 'X';
    move = findBestMove(opponent);
    if (move !== null) {
        makeMove(cells[move]);
        return;
    }

    easyAIMove();
}

function hardAIMove() {
    let bestScore = -Infinity;
    let bestMove;
    cells.forEach((cell, index) => {
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            let score = minimax(cells, 0, false);
            cell.textContent = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });
    makeMove(cells[bestMove]);
}

function minimax(cells, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -1 : 1;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach((cell, index) => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                let score = minimax(cells, depth + 1, false);
                cell.textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        let opponent = currentPlayer === 'X' ? 'O' : 'X';
        cells.forEach((cell, index) => {
            if (cell.textContent === '') {
                cell.textContent = opponent;
                let score = minimax(cells, depth + 1, true);
                cell.textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function findBestMove(player) {
    for (let combination of winningCombinations) {
        let [a, b, c] = combination;
        if (cells[a].textContent === player && cells[b].textContent === player && cells[c].textContent === '') {
            return c;
        } else if (cells[a].textContent === player && cells[c].textContent === player && cells[b].textContent === '') {
            return b;
        } else if (cells[b].textContent === player && cells[c].textContent === player && cells[a].textContent === '') {
            return a;
        }
    }
    return null;
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('playerX', 'playerO');
    });
    currentPlayer = 'X';
    isGameActive = true;
    statusMessageElement.textContent = `Player ${currentPlayer}'s turn`;
    statusMessageElement.classList.remove('win-message', 'draw-message');
    isAgainstAI = modeSelect.value !== 'player';
    aiDifficulty = modeSelect.value === 'easy-ai' ? 'easy' :
                   modeSelect.value === 'medium-ai' ? 'medium' :
                   (modeSelect.value === 'hard-ai' ? 'hard' : null);
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);

modeSelect.addEventListener('change', resetGame);

resetGame();
