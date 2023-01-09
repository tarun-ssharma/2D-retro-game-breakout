//Constants
//HTML RELATED CONSTANTS
const canvasId = 'breakout';
const canvas = document.getElementById(canvasId);
const ctx = canvas.getContext('2d');
//ctx.globalAlpha = .6;

//1. PADDLE
const paddleBottomOffset = 50;
const paddleHeight = 10;
const paddleWidth = 60;
const paddleSpeedX = 5;
const paddleSpeedY = 0;
const paddleSpeed = 5;
const paddleFillColor = "#2e3548";
const paddleBorderColor = "#ffcd05";

//2. BALL
const ballRadius = 8;
const ballSpeed = 5;
const ballSpeedX = 3;
const ballSpeedY = -4;
const ballFillColor = "#ffcd05";
const ballBorderColor = "#2e3548";
const ballRotationDegrees = 10 

//3. small icons
const iconHeight = 20;
const iconWidth = 20;
const fontSize = "20px";
const iconTextGap = 5;

const iconScore = {x:5, y:5};
const iconLevel = {x:canvas.width - 55, y:5};
const iconLives = {x:canvas.width / 2 - 30, y:5};

//4. BRICKS
const brickFillColor = "#0095DD"
const brickBorderColor = "#2e3548"
let brickRowCount = 3;//3
const brickColumnCount = 6;//6
const brickWidth = 75;
const brickHeight = 10;
const brickPadding = 10;
const brickOffsetTop = iconScore.y+iconHeight+20;
const brickOffsetLeft = (canvas.width - brickColumnCount*brickWidth- (brickColumnCount-1)*brickPadding)/2;
const bricks = [];


//Game assets -- images and sounds!
const BG_IMG_SRC = "https://raw.githubusercontent.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/d3903312529aea0e3b541b691dc3eaaad84b5bc4/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/img/bg.jpg";
const BG_IMG = new Image();
/* BG_IMG.crossOrigin = "anonymous";*/
BG_IMG.src = BG_IMG_SRC;

const SCORE_IMG_SRC = "https://raw.githubusercontent.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/img/score.png";
//const SCORE_IMG_SRC ="https://cdn-icons-png.flaticon.com/512/1239/1239281.png?w=740&t=st=1671028853~exp=1671029453~hmac=5d26be5d522a1d4cb7121a4ab24fc0c5f2b9e26107f4e90cb0ed867cebd1d9b7"
const SCORE_IMG = new Image();
SCORE_IMG.src = SCORE_IMG_SRC;

const LIVES_IMG_SRC = "https://raw.githubusercontent.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/img/life.png";
const LIVES_IMG = new Image();
LIVES_IMG.src = LIVES_IMG_SRC;

const LEVEL_IMG_SRC = "https://raw.githubusercontent.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/img/level.png";
const LEVEL_IMG = new Image();
LEVEL_IMG.src = LEVEL_IMG_SRC;

//// Add sounds ////
const WALL_COLLISION = new Audio();
WALL_COLLISION.src = "https://github.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/blob/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/sounds/wall.mp3?raw=true"

const LIFE_LOSS = new Audio();
LIFE_LOSS.src = "https://github.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/blob/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/sounds/life_lost.mp3?raw=true"

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "https://github.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/blob/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/sounds/paddle_hit.mp3?raw=true"

const BRICK_HIT = new Audio();
BRICK_HIT.src = "https://github.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/blob/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/sounds/brick_hit.mp3?raw=true"

const WIN = new Audio();
WIN.src = "https://github.com/CodeExplainedRepo/2D-Breakout-Game-JavaScript/blob/master/2D%20Breakout%20Game%20JavaScript%20-%20FULL%20GAME/sounds/win.mp3?raw=true"

///////////////////////////////////////////

// document.getElementById("sound").style.left = document.getElementById(canvasId).style.left ;



/////// INITIALIZE GAME OBJECTS ///////

//Ball object
let b = {
    x: canvas.width / 2, //x-ccordinate of center of the ball
    y: canvas.height - paddleBottomOffset - paddleHeight - ballRadius,
    r: ballRadius,
    speed: ballSpeed,
    dx: ballSpeedX,
    dy: ballSpeedY,
    fillColor: ballFillColor,
    borderColor: ballBorderColor
}

//Paddle object
let p = {
    x: (canvas.width - paddleWidth) / 2,
    y: (canvas.height - paddleBottomOffset - paddleHeight),
    width: paddleWidth,
    height: paddleHeight,
    dx: paddleSpeedX,
    dy: paddleSpeedY,
    speed: paddleSpeed,
    fillColor: paddleFillColor,
    borderColor: paddleBorderColor
}

//bricks container
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

// OTHER GAME RELATED VARIABLES
let score = 0;
let lives = 3;
let level = 1;
const maxLevels = 3;
let gameOver = false;
let won=false;
let rightPressed = false;
let leftPressed = false;
let muted = false;
let paused=false;
let ballRotatedRadians = 0;
//////////////// Add event listeners /////////////////
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(k) {
    if (k.key === "Right" || k.key === "ArrowRight") {
        rightPressed = true;
    } else if (k.key === "Left" || k.key === "ArrowLeft") {
        leftPressed = true;
    }
}

//here k will be an event
function keyUpHandler(k) {
    if (k.key === "Right" || k.key === "ArrowRight") {
        rightPressed = false;
    } else if (k.key === "Left" || k.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function muteUnmute() {
    if (!muted) {
        document.getElementById("sound").src = "assets/SOUND_OFF.png"
        muted = true;
        WALL_COLLISION.muted = true;
        LIFE_LOSS.muted = true;
        PADDLE_HIT.muted = true;
        BRICK_HIT.muted = true;
        WIN.muted = true;
    } else {
        document.getElementById("sound").src = "assets/SOUND_ON.png"
        muted = false;
        WALL_COLLISION.muted = false;
        LIFE_LOSS.muted = false;
        PADDLE_HIT.muted = false;
        BRICK_HIT.muted = false;
        WIN.muted = false;
    }
}

function pausePlay() {
    if (!paused) {
        document.getElementById("pause").src = "assets/PLAY.png"
        paused = true;
    } else {
        document.getElementById("pause").src = "assets/PAUSE.png"
        paused = false;
    }
}

function restartGame(){
  window.location.reload();
}
////////////////  START DRAWING LOGIC ////////////////

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(p.x, p.y, p.width, p.height);
    ctx.fillStyle = p.fillColor;
    ctx.fill();
    ctx.strokeStyle = p.borderColor;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(p.x+p.width/2, p.y+p.height/2, 2, 0, 2*Math.PI);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddleTopMargin(){
  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.moveTo(0,p.y);
  ctx.lineTo(canvas.width, p.y);
  ctx.strokeStyle = "#000";
  ctx.stroke();
  ctx.closePath();
  ctx.setLineDash([]);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, ballRotatedRadians, ballRotatedRadians+Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = b.borderColor;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, ballRotatedRadians+Math.PI,  ballRotatedRadians+2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = b.borderColor;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(b.x+Math.cos(ballRotatedRadians)*b.r/2, b.y+Math.sin(ballRotatedRadians)*b.r/2, b.r/2, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(b.x-Math.cos(ballRotatedRadians)*b.r/2, b.y-Math.sin(ballRotatedRadians)*b.r/2, b.r/2, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(b.x+Math.cos(ballRotatedRadians)*b.r/2, b.y+Math.sin(ballRotatedRadians)*b.r/2, b.r/4, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(b.x-Math.cos(ballRotatedRadians)*b.r/2, b.y-Math.sin(ballRotatedRadians)*b.r/2, b.r/4, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    ballRotatedRadians += Math.PI * 2 * ballRotationDegrees/ 360;
    ballRotatedRadians = ballRotatedRadians % (Math.PI*2);
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                bricks[c][r].x = brickOffsetLeft + c * (brickWidth + brickPadding);
                bricks[c][r].y = brickOffsetTop + r * (brickHeight + brickPadding);;
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = brickFillColor;
                ctx.fill();
                ctx.strokeStyle = brickBorderColor;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawGameStat(text, textX, textY, img, imgX, imgY) {
    ctx.font = `${fontSize} Verdana`;
    ctx.fillStyle = "#000";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, iconWidth, iconHeight);
}

function drawGameStats() {
    //TODO: Move the constants up
    drawGameStat(score, iconScore.x + iconWidth + iconTextGap, iconScore.y + iconHeight - 2, SCORE_IMG, iconScore.x, iconScore.y);
    drawGameStat(lives, iconLives.x + iconWidth + iconTextGap, iconLives.y + iconHeight - 2, LIVES_IMG, iconLives.x, iconLives.y);
    drawGameStat(level, iconLevel.x + iconWidth + iconTextGap, iconLevel.y + iconHeight - 2, LEVEL_IMG, iconLevel.x, iconLevel.y);
}

function draw() {
    drawPaddle();
    drawPaddleTopMargin();
    drawBall();
    drawBricks();
    drawGameStats();
}

function moveBall() {
    b.x += b.dx;
    b.y += b.dy;
}

function movePaddle() {
    if (rightPressed) {
        p.x = Math.min(p.x + p.dx, canvas.width - paddleWidth);
    } else if (leftPressed) {
        p.x = Math.max(p.x - p.dx, 0);
    }
}

function moveObjects() {
    moveBall();
    movePaddle();
}

function detectBallWallCollision() {
    //vertical walls
    if (b.y + b.dy - b.r < 0) {
        //hit top wall
        WALL_COLLISION.play();
        b.dy = -b.dy;
    } else if (b.y + b.dy > canvas.height - b.r - paddleBottomOffset - paddleHeight) {
        //hit bottom wall
        if (b.x >= p.x - ballRadius && b.x <= p.x + p.width) {
            //Collided with paddle
            PADDLE_HIT.play();
            //TODO: Change this
            let distanceFromPaddleCenter = Math.abs(b.x - (p.x + p.width / 2));
            let ratio = distanceFromPaddleCenter/(p.width/2)

            let motionDirectionX = b.x > (p.x + p.width / 2) ? 1 : -1;
            b.dy = -1 * ballSpeed*Math.cos(60*ratio*2*Math.PI / 360);
            b.dx = motionDirectionX * ballSpeed*Math.sin(60*ratio*2*Math.PI / 360);
            //b.dy = -b.dy;
        } else {
            lives--;
            LIFE_LOSS.play();
            if (lives<=0) {
                //All lives exhausted
                gameOver = true;
            } else {
                //reset coordinates of the ball and paddle
                //rest all remains the sam 
                b.x = canvas.width / 2; //x-ccordinate of center of the ball
                b.y = canvas.height - paddleBottomOffset - paddleHeight - ballRadius;
                b.dx = ballSpeedX * (Math.random() * 2 - 1); //randomize the ball direction
                b.dy = ballSpeedY;
                //TODO: Reset paddle position as wel
            }
        }
    }

    //horizontal walls
    if (b.x + b.dx - b.r < 0 || b.x + b.dx + b.r > canvas.width) {
        WALL_COLLISION.play();
        b.dx = -b.dx;
    }
}

function detectBallBrickCollision() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status == 1 && brick.x <= b.x && (b.x <= brick.x + brickWidth) && (brick.y - b.r <= b.y) && (b.y <= brick.y + brickHeight + b.r)) {
                //brick hit
                BRICK_HIT.play();
                b.dy = -b.dy;
                brick.status = 0;
                score++;
                if (score == brickRowCount * brickColumnCount) {
                    if(level == maxLevels){
                    //TODO: Display the game over page
                    WIN.play();
                    gameOver = true;
                    won = true;
                  } else {
                      level++;
                      ctx.globalAlpha -= .1;
                      score = 0;
                      b.speed += 1;
                      brickRowCount += 2
                      //reset bricks
                      //bricks container
                      for (let c = 0; c < brickColumnCount; c++) {
                          bricks[c] = [];
                          for (let r = 0; r < brickRowCount; r++) {
                              bricks[c][r] = {
                                  x: 0,
                                  y: 0,
                                  status: 1
                              };
                          }
                      }
                  }

                }
            }
        }
    }
}

function detectCollisions() {
    detectBallWallCollision();
    detectBallBrickCollision();
}

function gameLoop() {
    //clear the canvas
    if(!paused){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(BG_IMG, 0, 0, canvas.width, canvas.height);
      draw();
      //TODO: Move should comen after collision detection?
      //No, I think because collision can happen only once you have moved the objects a bit
      moveObjects();
      detectCollisions();
    }
    if(gameOver){
      document.getElementById('gameover').style.display = "block";
      document.getElementById('gameover').style.width = "650px"; //including border size
      document.getElementById('gameover').style.height = "490px"; //including border size
      document.getElementById('restart').style.display = "block";
      if(won){
        document.getElementById('youwon').style.display = "block";
      } else {
        document.getElementById('youlose').style.display = "block";
      }
    }
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

 gameLoop();