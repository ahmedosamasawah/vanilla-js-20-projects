const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");

const ctx = canvas.getContext("2d");
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? "#0095dd" : "transparent";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function movePaddle() {
  paddle.x += paddle.dx;
  paddle.x + paddle.w > canvas.width && (paddle.x = canvas.width - paddle.w);
  paddle.x < 0 && (paddle.x = 0);
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) &&
    (ball.dx *= -1);
  (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) &&
    (ball.dy *= -1);

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.visible = false;
    paddle.visible = false;

    setTimeout(function () {
      showAllBricks();
      score = 0;
      paddle.x = canvas.width / 2 - 40;
      paddle.y = canvas.height - 20;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.visible = true;
      paddle.visible = true;
    }, delay);
  }
}

function showAllBricks() {
  bricks.forEach((column) => column.forEach((brick) => (brick.visible = true)));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

update();

function keyDown(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(event) {
  if (
    event.key === "Right" ||
    event.key === "ArrowRight" ||
    event.key === "Left" ||
    event.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));