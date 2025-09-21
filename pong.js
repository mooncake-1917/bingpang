const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 12;
const paddleGap = 30;

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

const paddleSpeed = 6;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight / 2;
    // Clamp to canvas
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > canvas.height - paddleHeight) leftPaddleY = canvas.height - paddleHeight;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left paddle
    ctx.fillStyle = "#0af";
    ctx.fillRect(paddleGap, leftPaddleY, paddleWidth, paddleHeight);

    // Right paddle
    ctx.fillStyle = "#fa0";
    ctx.fillRect(canvas.width - paddleGap - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Ball and paddle logic
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY *= -1;
        // Clamp
        if (ballY - ballRadius < 0) ballY = ballRadius;
        if (ballY + ballRadius > canvas.height) ballY = canvas.height - ballRadius;
    }

    // Left paddle collision
    if (
        ballX - ballRadius < paddleGap + paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1.05;
        ballX = paddleGap + paddleWidth + ballRadius;
        // Add effect based on hit position
        let deltaY = ballY - (leftPaddleY + paddleHeight / 2);
        ballSpeedY += deltaY * 0.15;
    }

    // Right paddle collision
    if (
        ballX + ballRadius > canvas.width - paddleGap - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1.05;
        ballX = canvas.width - paddleGap - paddleWidth - ballRadius;
        // Add effect based on hit position
        let deltaY = ballY - (rightPaddleY + paddleHeight / 2);
        ballSpeedY += deltaY * 0.15;
    }

    // Score (reset ball)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        resetBall();
    }

    // AI for right paddle
    let rightPaddleCenter = rightPaddleY + paddleHeight / 2;
    if (rightPaddleCenter < ballY - 15) {
        rightPaddleY += paddleSpeed;
    } else if (rightPaddleCenter > ballY + 15) {
        rightPaddleY -= paddleSpeed;
    }
    // Clamp right paddle
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY > canvas.height - paddleHeight) rightPaddleY = canvas.height - paddleHeight;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // Randomize direction
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();