const cells = document.querySelectorAll('[data-cell]');
const statusMessageElement = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
const xWinsCountElement = document.getElementById('xWinsCount');
const oWinsCountElement = document.getElementById('oWinsCount');
const drawsCountElement = document.getElementById('drawsCount');

let currentPlayer = 'X';
let isGameActive = true;
let isAgainstAI = false;
let aiDifficulty = null;

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
        updateScore(currentPlayer);
    } else if (checkDraw()) {
        statusMessageElement.textContent = "It's a draw! 🤝";
        statusMessageElement.classList.add('draw-message');
        statusMessageElement.classList.remove('win-message');
        isGameActive = false;
        incrementDraws();
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

function updateScore(winner) {
    if (winner === 'X') {
        xWinsCountElement.textContent = parseInt(xWinsCountElement.textContent) + 1;
    } else if (winner === 'O') {
        oWinsCountElement.textContent = parseInt(oWinsCountElement.textContent) + 1;
    }
}

function incrementDraws() {
    drawsCountElement.textContent = parseInt(drawsCountElement.textContent) + 1;
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
                   modeSelect.value === 'medium-ai' ? 'medium' : null;
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);

modeSelect.addEventListener('change', resetGame);

resetGame();
