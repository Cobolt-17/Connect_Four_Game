document.addEventListener("DOMContentLoaded", () => {
    const isIndex = !!document.getElementById("playBot");
    const isPlay = !!document.getElementById("board");

    if (isIndex) {
        initIndexPage();
    } else if (isPlay) {
        initPlayPage();
    }
});
function initIndexPage() {
    const popup = document.getElementById("popup");
    const player2Box = document.getElementById("player2Box");
    const botBox = document.getElementById("botBox");
    const closePopup = document.getElementById("closePopup");
    const playBot = document.getElementById("playBot");
    const playPerson = document.getElementById("playPerson");
    const startGame = document.getElementById("startGame");
    const player1NameInput = document.getElementById("player1Name");
    const player2NameInput = document.getElementById("player2Name");

    const avatars1 = document.querySelectorAll(".avatar1");
    const avatars2 = document.querySelectorAll(".avatar2");
    const coinButtons = document.querySelectorAll(".coin");
    const diffButtons = document.querySelectorAll(".difficulty");

    let gameMode = "bot";
    let player1Avatar = "images/avatar1.png";
    let player2Avatar = "images/avatar2.png";
    let botAvatar = "images/avatar2.png";
    let selectedCoin = "red";
    let difficulty = "Beginner";

    const allAvatarsList = [
        "images/avatar1.png",
        "images/avatar2.png",
        "images/avatar3.png",
        "images/avatar4.png",
        "images/avatar5.png",
        "images/avatar6.png"
    ];
    function syncInitialStateFromUI() {
        const activeAv1 = Array.from(avatars1).find(a => a.classList.contains("active"));
        if (activeAv1) player1Avatar = activeAv1.dataset.avatar;
        const activeAv2 = Array.from(avatars2).find(a => a.classList.contains("active"));
        if (activeAv2) player2Avatar = activeAv2.dataset.avatar;
        const activeCoin = Array.from(coinButtons).find(c => c.classList.contains("active"));
        if (activeCoin) selectedCoin = activeCoin.dataset.coin;
        const activeDiff = Array.from(diffButtons).find(d => d.classList.contains("active"));
        if (activeDiff) difficulty = activeDiff.dataset.level;
        updateBotAvatar();
    }
    function updateBotAvatar() {
        botAvatar = allAvatarsList.find(a => a !== player1Avatar) || "images/avatar2.png";
    }
    avatars1.forEach(avatar => {
        avatar.addEventListener("click", () => {
            avatars1.forEach(a => a.classList.remove("active"));
            avatar.classList.add("active");
            player1Avatar = avatar.dataset.avatar;
            if (gameMode === "person" && player1Avatar === player2Avatar) {
                const nextAv2 = Array.from(avatars2).find(a => a.dataset.avatar !== player1Avatar);
                if (nextAv2) {
                    avatars2.forEach(a => a.classList.remove("active"));
                    nextAv2.classList.add("active");
                    player2Avatar = nextAv2.dataset.avatar;
                }
            }
            updateBotAvatar();
        });
    });
    avatars2.forEach(avatar => {
        avatar.addEventListener("click", () => {
            avatars2.forEach(a => a.classList.remove("active"));
            avatar.classList.add("active");
            player2Avatar = avatar.dataset.avatar;
            if (player1Avatar === player2Avatar) {
                const nextAv1 = Array.from(avatars1).find(a => a.dataset.avatar !== player2Avatar);
                if (nextAv1) {
                    avatars1.forEach(a => a.classList.remove("active"));
                    nextAv1.classList.add("active");
                    player1Avatar = nextAv1.dataset.avatar;
                }
            }
        });
    });
    coinButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            coinButtons.forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            selectedCoin = btn.dataset.coin;
        });
    });
    diffButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            diffButtons.forEach(d => d.classList.remove("active"));
            btn.classList.add("active");
            difficulty = btn.dataset.level;
        });
    });
    closePopup.addEventListener("click", () => {
        popup.classList.remove("active");
    });
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("active");
        }
    });
    playBot.addEventListener("click", () => {
        gameMode = "bot";
        player2Box.style.display = "none";
        botBox.style.display = "block";
        syncInitialStateFromUI();
        popup.classList.add("active");
    });
    playPerson.addEventListener("click", () => {
        gameMode = "person";
        player2Box.style.display = "block";
        botBox.style.display = "none";
        syncInitialStateFromUI();
        if (player1Avatar === player2Avatar) {
            const nextAv2 = Array.from(avatars2).find(a => a.dataset.avatar !== player1Avatar);
            if (nextAv2) {
                avatars2.forEach(a => a.classList.remove("active"));
                nextAv2.classList.add("active");
                player2Avatar = nextAv2.dataset.avatar;
            }
        }
        popup.classList.add("active");
    });
    startGame.addEventListener("click", () => {
        popup.classList.remove("active");

        if (gameMode === "bot") {
            const p1Name = player1NameInput.value.trim() || "Player 1";
            localStorage.setItem("playerName", p1Name);
            localStorage.setItem("playerAvatar", player1Avatar);
            localStorage.setItem("playerCoin", selectedCoin);
            localStorage.setItem("botAvatar", botAvatar);
            localStorage.setItem("difficulty", difficulty);
            localStorage.setItem("gameMode", "bot");
            window.location.href = "playwithbots.html";
        } else {
            const p1Name = player1NameInput.value.trim() || "Player 1";
            const p2Name = player2NameInput.value.trim() || "Player 2";
            localStorage.setItem("player1Name", p1Name);
            localStorage.setItem("player2Name", p2Name);
            localStorage.setItem("player1Avatar", player1Avatar);
            localStorage.setItem("player2Avatar", player2Avatar);
            localStorage.setItem("player1Coin", selectedCoin);
            localStorage.setItem("player2Coin", selectedCoin === "red" ? "blue" : "red");
            localStorage.setItem("gameMode", "person");
            window.location.href = "playinperson.html";
        }
    });
    syncInitialStateFromUI();
}
let board = [];
let currentPlayer = "red";
let gameOver = false;
let difficulty = localStorage.getItem("difficulty") || "Beginner";
function initPlayPage() {
    const boardElement = document.getElementById("board");
    const backBtn = document.getElementById("backBtn");
    const topAvatar = document.getElementById("avatarTop");
    const bottomAvatar = document.getElementById("avatarBottom");
    const topName = document.getElementById("topName");
    const bottomName = document.getElementById("bottomName");
    const topType = document.getElementById("topType");
    const bottomType = document.getElementById("bottomType");
    const topCoin = document.getElementById("topCoin");
    const bottomCoin = document.getElementById("bottomCoin");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (gameOver) {
                window.location.href = "index.html";
            }
            else {
                document.getElementById("homePopup").style.display = "flex";
            }
        });
    }
    const homePopup = document.getElementById("homePopup");
    const yesHomeBtn = document.getElementById("yesHomeBtn");
    const noHomeBtn = document.getElementById("noHomeBtn");
    backBtn.addEventListener("click", () => {
        homePopup.style.display = "flex";
    });
    yesHomeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    noHomeBtn.addEventListener("click", () => {
        homePopup.style.display = "none";
    });
    const isBotMode = window.location.pathname.includes("playwithbots") || localStorage.getItem("gameMode") === "bot";
    let p1Name = "Player 1";
    let p2Name = "Player 2";
    let p1AvatarVal = "images/avatar1.png";
    let p2AvatarVal = "images/avatar2.png";
    let botAvatarVal = "images/avatar2.png";
    let difficultyVal = "Beginner";
    let p1CoinColor = "red";
    let p2CoinColor = "blue";
    if (isBotMode) {
        p1Name = localStorage.getItem("playerName") || "Player 1";
        p1AvatarVal = localStorage.getItem("playerAvatar") || "images/avatar1.png";
        p1CoinColor = localStorage.getItem("playerCoin") || "red";
        botAvatarVal = localStorage.getItem("botAvatar") || "images/avatar2.png";
        difficultyVal = localStorage.getItem("difficulty") || "Beginner";
        p2CoinColor = p1CoinColor === "red" ? "blue" : "red";
        topName.textContent = p1Name;
        topAvatar.src = p1AvatarVal;
        topType.textContent = "(You)";
        topCoin.src = p1CoinColor === "red" ? "images/redcoin.png" : "images/bluecoin.png";
        bottomName.textContent = difficultyVal + " Bot";
        bottomAvatar.src = botAvatarVal;
        bottomType.textContent = "(Bot)";
        bottomCoin.src = p2CoinColor === "red" ? "images/redcoin.png" : "images/bluecoin.png";
    } else {
        p1Name = localStorage.getItem("player1Name") || "Player 1";
        p2Name = localStorage.getItem("player2Name") || "Player 2";
        p1AvatarVal = localStorage.getItem("player1Avatar") || "images/avatar1.png";
        p2AvatarVal = localStorage.getItem("player2Avatar") || "images/avatar2.png";
        p1CoinColor = localStorage.getItem("player1Coin") || "red";
        p2CoinColor = localStorage.getItem("player2Coin") || (p1CoinColor === "red" ? "blue" : "red");
        topName.textContent = p1Name;
        topAvatar.src = p1AvatarVal;
        topType.textContent = "(Player 1)";
        topCoin.src = p1CoinColor === "red" ? "images/redcoin.png" : "images/bluecoin.png";
        bottomName.textContent = p2Name;
        bottomAvatar.src = p2AvatarVal;
        bottomType.textContent = "(Player 2)";
        bottomCoin.src = p2CoinColor === "red" ? "images/redcoin.png" : "images/bluecoin.png";
    }
    setGame();

    function setGame() {
        boardElement.innerHTML = "";
        board = [];
        for (let r = 0; r < 6; r++) {
            let row = [];
            for (let c = 0; c < 7; c++) {
                row.push(" ");
                let tile = document.createElement("div");
                tile.id = r + "-" + c;
                tile.classList.add("tile");
                tile.addEventListener("click", makeMove);
                boardElement.appendChild(tile);
            }

            board.push(row);

        }
    }
    function makeMove() {
        if (gameOver) {
            return;
        }
        let coords = this.id.split("-");
        let c = parseInt(coords[1]);
        for (let r = 5; r >= 0; r--) {
            if (board[r][c] == " ") {
                board[r][c] = currentPlayer;
                let tile = document.getElementById(r + "-" + c);
                if (currentPlayer == "red") {
                    tile.classList.add("redcoin");
                    currentPlayer = "blue";
                } else {
                    tile.classList.add("bluecoin");
                    currentPlayer = "red";
                }
                break;
            }
        }
        checkWinner();
        if (isBotMode && !gameOver && currentPlayer == "blue") {
            setTimeout(botMove, 500);
        }
    }
    function checkWinner() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                        gameOver = true;
                        showWinner(board[r][c]);
                    }
                }
            }
        }
        for (let c = 0; c < 7; c++) {
            for (let r = 0; r < 3; r++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                        gameOver = true;
                        showWinner(board[r][c]);
                    }
                }
            }
        }
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                        gameOver = true;
                        showWinner(board[r][c]);
                    }
                }
            }
        }
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] != " ") {
                    if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                        gameOver = true;
                        showWinner(board[r][c]);
                    }
                }
            }
        }
        let draw = true;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] == " ") {
                    draw = false;
                    break;
                }
            }
        }
        if (draw && !gameOver) {
            gameOver = true;
            showDraw();
        }
    }
    function showWinner(player) {
        gameOver = true;
        document.getElementById("popupTitle").textContent = "🏆 Winner";
        const popup = document.getElementById("winnerPopup");
        const winnerName = document.getElementById("winnerName");
        const winnerAvatar = document.getElementById("winnerAvatar");
        const winnerCoin = document.getElementById("winnerCoin");
        if (player == "red") {
            winnerName.textContent = topName.textContent;
            winnerAvatar.src = topAvatar.src;
            winnerCoin.src = topCoin.src;
        }
        else {
            winnerName.textContent = bottomName.textContent;
            winnerAvatar.src = bottomAvatar.src;
            winnerCoin.src = bottomCoin.src;
        }
        popup.style.display = "flex";
    }
    function showDraw() {
        const popup = document.getElementById("winnerPopup");
        document.getElementById("popupTitle").textContent = "🤝 Match Draw";
        document.getElementById("winnerName").textContent = "Nobody Wins";
        document.getElementById("winnerAvatar").src = "images/draw.png";
        document.getElementById("winnerCoin").style.display = "none";
        popup.style.display = "flex";
    }
    const playAgainBtn = document.getElementById("playAgainBtn");
    const homeBtn = document.getElementById("homeBtn");
    playAgainBtn.addEventListener("click", () => {
        location.reload();
    });
    const showResultBtn = document.getElementById("showResultBtn");
    showResultBtn.addEventListener("click", () => {
        document.getElementById("winnerPopup").style.display = "none";
    });
    homeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
    function botMove() {
        if (gameOver) return;
        let column;
        if (difficulty == "Beginner") {
            column = beginnerBot();
        }
        else if (difficulty == "Intermediate") {
            column = intermediateBot();
        }
        else {
            column = expertBot();
        }
        if (column == -1) return;
        let row = getRow(column);
        if (row == -1) return;
        board[row][column] = "blue";
        let tile = document.getElementById(row + "-" + column);
        tile.classList.add("bluecoin");
        checkWinner();
        if (!gameOver) {
            currentPlayer = "red";
        }
    }
    function minimax(depth, alpha, beta, maximizingPlayer) {
        if (depth == 0 || gameOver) {
            return evaluateBoard();
        }
        let validMoves = [];
        for (let c = 0; c < 7; c++) {
            if (board[0][c] == " ") {
                validMoves.push(c);
            }
        }
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let col of validMoves) {
                let row = getRow(col);
                if (row == -1) continue;
                board[row][col] = "blue";
                let score = minimax(depth - 1, alpha, beta, false);
                board[row][col] = " ";
                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        }
        else {
            let minEval = Infinity;
            for (let col of validMoves) {
                let row = getRow(col);
                if (row == -1) continue;
                board[row][col] = "red";
                let score = minimax(depth - 1, alpha, beta, true);
                board[row][col] = " ";
                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }
    function evaluateBoard() {
        let score = 0;
        score += scoreCenter();
        score += scoreHorizontal();
        score += scoreVertical();
        score += scoreDiagonal();
        score += scoreAntiDiagonal();
        return score;
    }
    function scoreCenter() {
        let score = 0
        for (let r = 0; r < 6; r++) {
            if (board[r][3] == "blue") score += 6;
            if (board[r][3] == "red") score -= 6;
        }
        return score;
    }
    function evaluateWindow(window) {
        let blue = 0;
        let red = 0;
        let empty = 0;
        for (let cell of window) {
            if (cell == "blue") blue++;
            else if (cell == "red") red++;
            else empty++;
        }
        let score = 0;
        if (blue == 4) score += 100000;
        else if (blue == 3 && empty == 1) score += 100;
        else if (blue == 2 && empty == 2) score += 10;
        if (red == 4) score -= 100000;
        else if (red == 3 && empty == 1) score -= 80;
        else if (red == 2 && empty == 2) score -= 8;
        return score;
    }
    function scoreHorizontal() {
        let score = 0;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r][c + 1],
                    board[r][c + 2],
                    board[r][c + 3]
                ]);
            }
        }
        return score;
    }
    function scoreVertical() {
        let score = 0;
        for (let c = 0; c < 7; c++) {
            for (let r = 0; r < 3; r++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r + 1][c],
                    board[r + 2][c],
                    board[r + 3][c]
                ]);
            }
        }
        return score;
    }
    function scoreDiagonal() {
        let score = 0;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r + 1][c + 1],
                    board[r + 2][c + 2],
                    board[r + 3][c + 3]
                ]);
            }
        }
        return score;
    }
    function scoreAntiDiagonal() {
        let score = 0;
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                score += evaluateWindow([
                    board[r][c],
                    board[r - 1][c + 1],
                    board[r - 2][c + 2],
                    board[r - 3][c + 3]
                ]);
            }
        }
        return score;
    }
    function getBestMove() {
        let bestScore = -Infinity;
        let bestColumn = 0;
        for (let c = 0; c < 7; c++) {
            let r = getRow(c);
            if (r == -1) continue;
            board[r][c] = "blue";
            let score = minimax(5, -Infinity, Infinity, false);
            board[r][c] = " ";
            if (score > bestScore) {
                bestScore = score;
                bestColumn = c;
            }
        }
        return bestColumn;
    }
    function expertBot() {
        return getBestMove();
    }
    function intermediateBot() {
        for (let c = 0; c < 7; c++) {
            let r = getRow(c);
            if (r == -1) continue;
            board[r][c] = "blue";
            if (isWinningMove()) {
                board[r][c] = " ";
                return c;
            }
            board[r][c] = " ";
        }
        for (let c = 0; c < 7; c++) {
            let r = getRow(c);
            if (r == -1) continue;
            board[r][c] = "red";
            if (isWinningMove()) {
                board[r][c] = " ";
                return c;
            }
            board[r][c] = " ";
        }
        return getBestMove();
    }
    function beginnerBot() {
        let moves = [];
        for (let c = 0; c < 7; c++) {
            if (board[0][c] == " ") {
                moves.push(c);
            }
        }
        return moves[Math.floor(Math.random() * moves.length)];
    }
    function intermediateBot() {
        for (let c = 0; c < 7; c++) {
            let r = getRow(c);
            if (r == -1) continue;
            board[r][c] = "blue";
            if (isWinningMove()) {
                board[r][c] = " ";
                return c;
            }
            board[r][c] = " ";
        }
        for (let c = 0; c < 7; c++) {
            let r = getRow(c);
            if (r == -1) continue;
            board[r][c] = "red";
            if (isWinningMove()) {
                board[r][c] = " ";
                return c;
            }
            board[r][c] = " ";
        }
        return beginnerBot();
    }
    function expertBot() {
        return getBestMove();
    }
    function getRow(col) {
        for (let r = 5; r >= 0; r--) {
            if (board[r][col] == " ") {
                return r;
            }
        }
        return -1;
    }
    function isWinningMove() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] != " " &&
                    board[r][c] == board[r][c + 1] &&
                    board[r][c] == board[r][c + 2] &&
                    board[r][c] == board[r][c + 3]) {
                    return true;
                }
            }
        }
        for (let c = 0; c < 7; c++) {
            for (let r = 0; r < 3; r++) {
                if (board[r][c] != " " &&
                    board[r][c] == board[r + 1][c] &&
                    board[r][c] == board[r + 2][c] &&
                    board[r][c] == board[r + 3][c]) {
                    return true;
                }
            }
        }
        return false;
    }
}