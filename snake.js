// board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// food
var foodX;
var foodY;

var gameOver = false;

// Initialize score and high score
var score = 0;
var highScore = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    // Load high score from local storage if available
    if (localStorage.getItem("highScore")) {
        highScore = parseInt(localStorage.getItem("highScore"));
        updateHighScore();
    }

    placeFood();
    document.addEventListener("keyup", changeDirection);
    // update();
    setInterval(update, 1000 / 10); //100 milliseconds
};

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "green";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX === foodX && snakeY === foodY) {
        score += 10; // Increase the score when the snake eats food
        document.getElementById('score').innerText = 'Score: ' + score;

        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (var i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "yellow";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (var i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // game over conditions
    if (snakeX < 0 || snakeX > cols * blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        gameOver = true;
        handleGameOver();
    }

    for (var i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            handleGameOver();
        }
    }
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    // (0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function handleGameOver() {
    // Update high score if the current score is higher
    if (score > highScore) {
        highScore = score;
        // Save high score to local storage
        localStorage.setItem("highScore", highScore);
        updateHighScore();
    }

    // Display game over alert
    alert("Game Over\nYour Score: " + score + "\nHigh Score: " + highScore);

    // Reset the game
    resetGame();
}

function resetGame() {
    // Reset snake position, body, and score
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody.length = 0;
    score = 0;

    // Reset game over flag
    gameOver = false;

    // Update the score display
    document.getElementById('score').innerText = 'Score: ' + score;
}

function updateHighScore() {
    // Update the high score display
    document.getElementById('high-score').innerText = 'High Score: ' + highScore;
}
