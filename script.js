const cells = document.querySelectorAll('[data-cell]');
const statusMessageElement = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
let currentPlayer = 'X';
let isGameActive = true;
let isAgainstAI = false;

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
            aiMove();
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

function aiMove() {
    let availableCells = Array.from(cells).filter(cell => cell.textContent === '');
    if (availableCells.length === 0) return;
    
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomCell);
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
    isAgainstAI = modeSelect.value === 'easy-ai';
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);

modeSelect.addEventListener('change', resetGame);

resetGame();
