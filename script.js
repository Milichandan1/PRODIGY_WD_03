document.addEventListener('DOMContentLoaded', () => {
    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp';
    let scores = { player1: 0, player2: 0, draws: 0 };

    const gameBoard = document.getElementById('game-board');
    const gameStatus = document.getElementById('game-status');
    const resetBtn = document.getElementById('reset-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const drawScore = document.getElementById('draw-score');

    function initializeBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell bg-white/5 rounded-xl aspect-square flex items-center justify-center text-5xl md:text-6xl font-bold cursor-pointer transition-all relative overflow-hidden';
            cell.dataset.index = i;

            const gradientOverlay = document.createElement('div');
            gradientOverlay.className = 'absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-transparent via-white/10 to-transparent';
            cell.appendChild(gradientOverlay);

            cell.addEventListener('click', () => handleCellClick(i));
            gameBoard.appendChild(cell);
        }
    }

    function handleCellClick(index) {
        if (!gameActive || board[index]) return;

        board[index] = currentPlayer;
        updateCell(index);

        const winner = checkWinner();
        if (winner) {
            endGame(winner);
        } else if (!board.includes('')) {
            endGame(null);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();

            if (gameMode === 'ai' && currentPlayer === 'O') {
                setTimeout(makeAIMove, 500);
            }
        }
    }

    function updateCell(index) {
        const cell = gameBoard.children[index];
        cell.classList.add('occupied');
        cell.innerHTML = currentPlayer === 'X'
            ? '<span class="text-pink-400">X</span>'
            : '<span class="text-blue-400">O</span>';

        cell.style.transform = 'scale(0)';
        setTimeout(() => (cell.style.transform = 'scale(1)'), 50);
    }

    function checkWinner() {
        const wins = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];

        for (const [a,b,c] of wins) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                [a,b,c].forEach(i => gameBoard.children[i].classList.add('winning-cell'));
                return board[a];
            }
        }
        return null;
    }

    function endGame(winner) {
        gameActive = false;
        if (winner) {
            gameStatus.innerHTML = winner === 'X'
                ? `<span class="text-pink-400">Player 1 (X) wins!</span>`
                : `<span class="text-blue-400">${gameMode === 'ai' ? 'AI' : 'Player 2'} (O) wins!</span>`;
            winner === 'X' ? player1Score.textContent = ++scores.player1 : player2Score.textContent = ++scores.player2;
        } else {
            gameStatus.innerHTML = `<span class="text-purple-400">Game ended in a draw!</span>`;
            drawScore.textContent = ++scores.draws;
        }
    }

    function updateStatus() {
        if (gameActive) {
            gameStatus.innerHTML = currentPlayer === 'X'
                ? `Player 1's turn (<span class="text-pink-400">X</span>)`
                : `${gameMode === 'ai' ? 'AI' : 'Player 2'}'s turn (<span class="text-blue-400">O</span>)`;
        }
    }

    function resetGame() {
        board.fill('');
        currentPlayer = 'X';
        gameActive = true;
        Array.from(gameBoard.children).forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('occupied', 'winning-cell');
        });
        updateStatus();
    }

    function newGame() {
        scores = { player1: 0, player2: 0, draws: 0 };
        player1Score.textContent = player2Score.textContent = drawScore.textContent = '0';
        resetGame();
    }

    function makeAIMove() {
        const move = findWinningMove('O') || findWinningMove('X') || getRandomMove();
        if (move !== null) handleCellClick(move);
    }

    function findWinningMove(player) {
        const wins = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        for (const [a,b,c] of wins) {
            if (board[a] === player && board[b] === player && !board[c]) return c;
            if (board[a] === player && board[c] === player && !board[b]) return b;
            if (board[b] === player && board[c] === player && !board[a]) return a;
        }
        return null;
    }

    function getRandomMove() {
        const available = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
        return available.length ? available[Math.floor(Math.random() * available.length)] : null;
    }

    function changeMode(mode) {
        gameMode = mode;
        modeButtons.forEach(btn => {
            btn.classList.toggle('bg-gradient-to-r', btn.dataset.mode === mode);
            btn.classList.toggle('from-pink-500', btn.dataset.mode === mode);
            btn.classList.toggle('to-purple-600', btn.dataset.mode === mode);
            btn.classList.toggle('bg-white/10', btn.dataset.mode !== mode);
        });
        resetGame();
    }

    // Events
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', newGame);
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => changeMode(btn.dataset.mode));
    });

    initializeBoard();
});
