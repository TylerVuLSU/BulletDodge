let heartSprite;
let bombSprite;

let timer;
let startTime = 0;
//gamestates {home, playing, end}
let gameState = "home";
//difficulties {easy, normal, hard}
let difficulty = "Easy";

let user;
let xMovement = 0;
let yMovement = 0;
let numOfLives = 3;
let numOfBombs = 3;
let score = 0;

let bulletArray = [];
let bulletTimer;
let bulletAdded = false;
let minSpeed;
let maxSpeed;

//-------------------------------------------------------------------------------------

function preload() {
  heartSprite = loadImage("images/heart.png");
  bombSprite = loadImage("images/bomb.png");
}

function setup() {
  createCanvas(1000, 600);
  user = new player(numOfLives, numOfBombs);
}

function draw() {
  background(220);
  timer = round(millis()/1000);
  if(gameState == "home") {
    homeScreen();
    startTime = timer;
  }
  else if(gameState == "playing") {
    playingScreen();
  }
  else if(gameState == "end") {
    endScreen();
  }
  
}

//-------------------------------------------------------------------------------------

function homeScreen() {
  homeText();
  if(mouseIsPressed) {
    if((mouseX > 300) && (mouseX < 700) && (mouseY > 150) && (mouseY < 250)) {
      homeScreenSelection("Easy", 10, 7, .5, 3);
    }
    else if((mouseX > 300) && (mouseX < 700) && (mouseY > 300) && (mouseY < 400)) {
      homeScreenSelection("Normal", 15, 5, 1.5, 4);
    }
    else if((mouseX > 300) && (mouseX < 700) && (mouseY > 450) && (mouseY < 550)) {
      homeScreenSelection("Hard", 20, 3, 2.5, 5);
    }
  }
}

function playingScreen() {
  score = timer - startTime;
  gameBorder();
  leftSideBar();
  rightSidebar();
  movement();
  for(var i = 0; i < bulletArray.length; i++) {
    bulletArray[i].move();
    bulletArray[i].draw();
    bulletArray[i].collide(user);
  }

  user.draw();
  user.checkDeadTimer();
  bombDisplay();

  if(!bulletAdded && (score % bulletTimer == 0)) {
    createBullet();
    bulletAdded = true;
  }

  if(score % bulletTimer == 1) {
    bulletAdded = false;
  }

  if(numOfLives == 0) {
    gameState = "end";
  }
}

function endScreen() {
  fill(0);
  stroke(0);
  textSize(100);
  text("Bullet Dodge", 200, 100);
  textSize(75);
  text("Difficulty: ", 200, 200);
  text(difficulty, 550, 200);
  text("Score: ", 200, 300);
  text(score, 450, 300);

  fill(255);
  rectMode(CORNER);
  rect(225, 350, 360, 100);
  fill(0);
  stroke(0);
  text("Try Again", 245, 420);
  if(mouseIsPressed) {
    if((mouseX > 225) && (mouseX < 585) && (mouseY > 350) && (mouseY < 450)) {
      location.reload();
    }
  }
}

//-------------------------------------------------------------------------------------

function homeText() {
  stroke(0);
  fill(255);
  rect(300, 150, 400, 100);
  rect(300, 300, 400, 100);
  rect(300, 450, 400, 100);
  fill(0);
  textSize(100);
  text("Bullet Dodge", 200, 100);
  textSize(80);
  text("Easy", 400, 225);
  text("Normal", 365, 380);
  text("Hard", 400, 525);
}

function homeScreenSelection(newDiff, startingBulletCount, newBulletTimer, newMinSpeed, newMaxSpeed) {
  gameState = "playing";
  difficulty = newDiff;
  bulletTimer = newBulletTimer;
  minSpeed = newMinSpeed;
  maxSpeed = newMaxSpeed;
  for(var i = 0; i < startingBulletCount; i++) {
    createBullet();
  }
}

//-------------------------------------------------------------------------------------

function gameBorder() {
  stroke(0);
  fill(255);
  rectMode(CORNER);
  rect(300, 10, 400, 580);
}

function leftSideBar() {
  fill(255);
  rect(75, 50, 30, 30);
  rect(45, 80, 30, 30);
  rect(75, 80, 30, 30);
  rect(105, 80, 30, 30);
  rect(45, 130, 90, 30);
  fill(0);
  text("Keyboard Controls", 20, 25);
  textSize(20);
  fill(50);
  text("Movement", 150, 90);
  text("Bomb", 150, 150);
  line(80, 75, 90, 55);
  line(100, 75, 90, 55);
  line(70, 85, 50, 95);
  line(70, 105, 50, 95);
  line(80, 85, 90, 105);
  line(100, 85, 90, 105);
  line(110, 85, 130, 95);
  line(110, 105, 130, 95);
  line(75, 140, 75, 150);
  line(105, 140, 105, 150);
  line(75, 150, 105, 150);
}

function rightSidebar() {
  fill(50);
  textSize(30);
  text("Score", 725, 50);
  text("Lives", 725, 150);
  text("Bombs", 725, 250);
  
  text(score, 725, 100);

  for(var i = 0; i < numOfLives; i++) {
    image(heartSprite, 725 + (i * 30), 175, 25, 25, 0, 0, 64, 64);
  }

  for(var i = 0; i < numOfBombs; i++) {
    image(bombSprite, 725 + (i * 30), 275, 25, 25, 0, 0, 16, 16);
  }

  text(difficulty, 725, 550);
}

function createBullet() {
  bulletArray.push(new bullet(random(303, 697), random(13, 75), random(minSpeed, maxSpeed)));
}

function useBomb() {
  var bulletsDestroyed = 0;
  bombDisplayX = user.getX();
  bombDisplayY = user.getY();
  bombTimer = timer;
  for(var i = 0; i < bulletArray.length; i++) {
    if(bulletArray[i].inRangeOfBomb(user)) {
      bulletArray.splice(i, 1);
      i--;
      bulletsDestroyed++;
    }
  }

  for(var i = 0; i < bulletsDestroyed / 2; i++) {
    createBullet();
  }

  numOfBombs--;
}

let bombDisplayX;
let bombDisplayY;
let bombTimer;
function bombDisplay() {
  if(bombTimer + 2 > timer) {
    rectMode(CENTER);
    fill(200, 0, 0 , 100);
    rect(bombDisplayX, bombDisplayY, 300, 300);
  }
}

//-------------------------------------------------------------------------------------

function movement() {
  if(keyIsDown(LEFT_ARROW))
    xMovement = -2;
  if(keyIsDown(RIGHT_ARROW))
    xMovement = 2;

  if(keyIsDown(DOWN_ARROW))
    yMovement = 2;
  if(keyIsDown(UP_ARROW))
    yMovement = -2;

  user.move(xMovement, yMovement);
}

function keyPressed() {
  if(gameState == "playing" && keyCode == 32 && numOfBombs > 0) {
    useBomb();
  }
}

function keyReleased() {
  if(!keyIsDown(LEFT_ARROW) || !keyIsDown(RIGHT_ARROW))
    xMovement = 0;
  if(!keyIsDown(UP_ARROW) || !keyIsDown(DOWN_ARROW))
    yMovement = 0;

    user.move(xMovement, yMovement);
}

//-------------------------------------------------------------------------------------

class player {
  constructor(/*spreadsheet,*/) {
    //this.spreadsheet = spreadsheet;
    this.x = 500;
    this.y = 500;
    this.immune = false;
    this.deadTimer = 0;
  }

  isImmune() {
    return this.immune;
  }

  playerHit(newTimer) {
    this.immune = true;
    this.deadTimer = newTimer
  }

  checkDeadTimer() {
    if((this.deadTimer + 3) < timer) {
      this.immune = false;
    }
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  draw() {
    rectMode(CENTER);
    if(this.immune) {
      fill(255, 255, 0, 100);
    }
    else {
      fill(0);
    }
    rect(this.x, this.y, 32, 32);
  }

  move(newX, newY) {
    if(this.x > 316 && newX < 0)
      this.x += newX;
    else if(this.x < 684 && newX > 0)
      this.x += newX;

    if(this.y > 26 && newY < 0)
      this.y += newY;
    else if(this.y < 574 && newY > 0)
      this.y += newY;
  }
}

//-------------------------------------------------------------------------------------

class bullet {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  draw() {
    rectMode(CENTER);
    fill(0);
    rect(this.x, this.y, 3, 3);
  }

  move() {
    this.y += this.speed;
    if(this.y > 587) {
      this.y = 13;
    }
  }

  resetBullet() {
    this.y = random(13, 50);
    this.x = random(303, 697);
  }

  inRangeOfBomb(user) {
    if((this.x > (user.getX() - 150)) && (this.x < (user.getX() + 150))
          && (this.y > (user.getY() - 150)) && (this.y < (user.getY() + 150))) {
      return true;
    }
    else {
      return false;
    }
  }

  collide(user) {
    if(!user.isImmune()) {
      if((this.x > (user.getX() - 16)) && (this.x < (user.getX() + 16))
          && (this.y > (user.getY() - 16)) && (this.y < (user.getY() + 16))) {
        user.playerHit(timer);
        numOfLives--;
        this.resetBullet();
      }
    }
  }
}