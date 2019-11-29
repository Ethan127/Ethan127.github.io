var moveX, centerX, X, velX, angle, aimR, mass, rectSL, moveY, centerY, Y, velY, seconds, timeElapsed, startTime, TOD, record;
var backgroundI, rocket, ast1, ast2, ast3, rocketImage, rocketImage2, myFont;
var keyW, keyA, keyS, keyD, alive;
var numAst, timesDied, numAmo, amoNum, Score, numAstShot;
var rocks, bullets;
var scores;

function preload() {
  backgroundI = loadImage("assets/Background.png");
  ast1 = loadImage("assets/a1.png");
  ast2 = loadImage("assets/a2.png");
  ast3 = loadImage("assets/a3.png");
  rocket = loadImage("assets/rocketwithoutflame.png");
  rocket1 = loadImage("assets/rocketwithoutflame.png");
  rocket2 = loadImage("assets/rocket.png");
  myFont = loadFont("/assets/montserrat/Montserrat-Bold.otf");
}

//Determines angle based on vector (x and y values) using inverse tangent
function theA(x, y){
  var tAngle = 0;
  if (x>0 && y>0){
    tAngle = atan(abs(y)/abs(x));
  }
  if (x>0 && y<0){
    tAngle = 2*PI - atan(abs(y)/abs(x));
  }
  if (x<0 && y>0){
    tAngle = atan(abs(x)/abs(y)) + PI/2;
  }
  if (x<0 && y<0){
    tAngle = atan(abs(y)/abs(x))+PI;
  }
  return tAngle;
}

//Partially setups the game
function partialSetup(){
  //Sets starting values for variables
  moveX = 0;
  moveY = 0;
  centerX = 1;
  centerY = 1;
  X = width/2;
  Y = height/2;
  velX = random(-1,1);
  velY = random(-1,1);
  aimR = 0;
  Score = 0;
  numAstShot = 0;
  
  //An array of rocks
  rocks = new Array(numAst);
  let index = 0;
  for (let x = 0; x < numAst; x++) {
    rocks[index++] = new Asteroid(random(10,20), random(0,5), random(0,2*PI), random(255), random(255), random(255), random(width), random(height), floor(random(1,4)), random(-0.1,0.1));
  }
}

function setup() { 
  createCanvas(windowWidth, windowHeight, WEBGL); 
  noStroke();
  rectMode(CENTER);
  
  //Sets starting values for variables
  keyW = false;
  keyA = false;
  keyS = false;
  keyD = false;
  alive = true;
  timeElapsed = 0;
  timesDied = 0;
  TOD = 0;
  startTime = millis();
  amoNum = 0;
  
  //Modifiable
  mass = 10;
  rectSL = 30;
  numAst = 15;
  numAmo = 10; //Highest number of bullets on screen at once
  
  //Partially setups the game
  partialSetup();
  textFont(myFont);
  
  //Array of every score
  scores = new Array(500);
  
  //Array of amo
  bullets = new Array(numAmo);
  for (var x = 0; x < numAmo; x++) {
    bullets[x] = new Amo(0,0,0,0,0,0,0,0);
  }
}

function mouseClicked(){
  //Revives you
  if(alive==false){
    alive = true;
    partialSetup();
    loop();
  }
  //Shoots
  if(alive==true){
    amoNum++;
    bullets[amoNum] = new Amo(5, 5, angle, random(255), random(255), random(255), centerX, centerY);
    if (amoNum == numAmo-1){
      amoNum = 0;
    }
  }
}

function draw() {
  //Checks time passed
  timeElapsed = millis() - startTime - TOD;
  seconds = timeElapsed / 1000;
  
  //Score keeper
  Score = (round(timeElapsed) + 1000*numAstShot)/10;
  
  //Sets background to space image
  //background(backgroundI);
  background(0);
  
  //Updates location of rocks and amo
  for (const rock of rocks) {
    rock.update();
    rock.display();
  }
  for (const bullet of bullets) {
    bullet.update();
    bullet.display();
  }
  
  //Determines angle of rotation of spaceship (using inverse tangent)
  //If statements figure out what quadrant the mouse is in relative to the center
  //Function located below
  angle = theA(mouseX-centerX, mouseY-centerY);
  
  //Translates space ship around unless its on an edge
  moveX = moveX + velX/mass;
  moveY = moveY + velY/mass;
  centerX = X+moveX;
  centerY = Y+moveY;
  //Loops position back around
  if (centerX <= 0 || centerY <= 0 || centerX >= width || centerY >= height){
    moveX = 0;
    moveY = 0;
    Y = height - centerY;
    X = width - centerX;
  }
  
  //Trigonometry in a backwards coordinate plane is hard, OK?
  //Manual rotation of polygon vector coordinates
  var a1 = centerX  +  rectSL*sqrt(2)*cos(angle);
  var b1 = centerY  +  rectSL*sqrt(2)*sin(angle);
  var a2 = centerX  +  rectSL*sqrt(2)*cos(angle+PI/2);
  var b2 = centerY  +  rectSL*sqrt(2)*sin(angle+PI/2);
  var a3 = centerX  +  rectSL*sqrt(2)*cos(angle+PI);
  var b3 = centerY  +  rectSL*sqrt(2)*sin(angle+PI);
  var a4 = centerX  +  rectSL*sqrt(2)*cos(angle+3*PI/2);
  var b4 = centerY  +  rectSL*sqrt(2)*sin(angle+3*PI/2);
  
  //Creates square that I can easily manipulate
  beginShape();
  texture(rocket);
  vertex(a1,b1,0,0);
  vertex(a2,b2,600,0);
  vertex(a3,b3,600,600);
  vertex(a4,b4,0,600);
  endShape();
  
  //What to do when keys are presssed
  if(keyW==true){
    velY += sin(angle);
    velX += cos(angle);
  }
  if(keyS==true){
    velY -= 0.5*sin(angle);
    velX -= 0.5*cos(angle);
  }
  if(keyA==true){
    velY -= 0.5*sin(angle+PI/2);
    velX -= 0.5*cos(angle+PI/2);
  }
  if(keyD==true){
    velY += 0.5*sin(angle+PI/2);
    velX += 0.5*cos(angle+PI/2);
  }
  
  //Displays information on screen
  var minute = floor(seconds / 60);
  var second = floor(seconds % 60);
  var velocity = sqrt(velX*velX+velY*velY);
  var rAngle = 360 - theA(mouseX-centerX, mouseY-centerY)*180/PI;
  var vAngle = 360 - theA(velX, velY)*180/PI;
  
  var s1 = "Velocity: " + velocity + "m/s";
  var s2 = "Angle of velocity: " + vAngle + "\u00b0";
  var s3 = "Angle of rotation: " + rAngle + "\u00b0";
  var s4 = "You have survived " + minute + " minutes and " + second + " seconds.";
  var s5 = "Your high score is " + round(Record());
  textSize(15);
  fill(255,255,0);
  text(s1, 25, 25); 
  text(s2, 350, 25); 
  text(s3, 700, 25); 
  text(s4, 300, 55);
  fill(66, 200, 244);
  rectMode(CENTER);
  text(s5, width/2, height, 180, 50);
  
  //Game over screen
  var game;
  var survival;
  var mess;
  var gameTrans;
  var highScore;
  var s6;
  if(alive==false){
    survival = "You survived for " + minute + " minutes and " + second + " seconds.";
    game = "Game Over";
    mess = "Just click your mouse to retry.";
    gameTrans = 200;
    s6= "";
    highScore = "Score: " + Score;
  }else{
    s6 = "Score: " + Score;
    highScore = "";
    survival = "";
    game = "";
    mess = "";
    gameTrans = 0;
  }
  rectMode(RADIUS);
  fill(0,255,100,gameTrans);
  rect(width/2, height/2+50, 300, 125, 100);
  textSize(50);
  fill(0,0,0, 255);
  text(game, width/2-143, height/2);
  textSize(25);
  text(survival, width/2-250, height/2+100);
  textSize(18);
  text(mess, width/2-145, height/2+150);
  rectMode(CENTER);
  textSize(25);
  fill(66, 200, 244);
  text(s6, width/2, height-30, 150, 50);
  fill(0, 0, 0, 255);
  text(highScore, width/2, height/2+60, 150, 50);
  rectMode(CORNER); 
}


//Key press events
function keyPressed() {
    if (key == 'a') {
      keyA = true;
    } else if (key == 'd') {
      keyD = true;
    }else if (key == 'w') {
      keyW = true;
      rocket = rocket2;
    }else if (key == 's') {
      keyS = true;
    }
}
function keyReleased() {
    if (key == 'a') {
      keyA = false;
      rocket = rocket1;
    } else if (key == 'd') {
      keyD = false;
      rocket = rocket1;
    }else if (key == 'w') {
      keyW = false;
      rocket = rocket1;
    }else if (key == 's') {
      keyS = false;
      rocket = rocket1;
    }
}

//Asteroid Class
class Asteroid {
  //Contructor
  constructor( i1,  i2,  i3,  i4,  i5,  i6,  i7,  i8,  i9,  i10) {
    this.size = i1;
    this.velA = i2;
    this.aDir = i3;
    this.colora = i4;
    this.colorb = i5;
    this.colorc = i6;
    this.startx = i7;
    this.starty = i8;
    this.aType = i9;
    this.astRot = i10;
    this.xpos = 0;
    this.ypos = 0;
    this.astR = 0;
    this.movement = 0;
    this.ran=0;
    this.px1 = 0;
    this.py1 = 0;
    this.px2 = 0;
    this.py2 = 0;
    this.px3 = 0;
    this.py3 = 0;
    this.px4 = 0;
    this.py4 = 0;
  }
  //Constantly moves in a direction
  update() {
    this.xpos = this.startx + this.movement * cos(this.aDir);
    this.ypos = this.starty + this.movement * sin(this.aDir);
    this.astR = this.astR + this.astRot;
    this.movement += this.velA;
    //Resets position if it goes to an edge
    if (this.xpos <= 0 || this.xpos >= width || this.ypos <= 0 || this.ypos >= height){
      this.movement = 0;
      this.ran = floor(random(1,5));
      if(this.ran==1){
        this.startx = random(1,width-1);
        this.starty = 1;
      }
      if(this.ran==2){
        this.startx = random(1,width-1);
        this.starty = height-1;
      }
      if(this.ran==3){
        this.startx = 1;
        this.starty = random(1,height-1);
      }
      if(this.ran==4){
        this.startx = width-1;
        this.starty = random(1,height-1);
      }
    }
    //If the rocket collides with an asteroid, you die
    if (sqrt(pow((centerX - this.xpos),2)+pow((centerY - this.ypos),2))<=(this.size+sqrt(2)*rectSL/2)){
      alive = false;
      noLoop();
      TOD = millis() - startTime;
      timesDied++;
      scores[timesDied] = Score;
    }
  }
  //Actually makes the asteroids
  display() {
    fill(this.colora,this.colorb,this.olorc);
    beginShape();
    if(this.aType == 1){
      texture(ast1);
    }
    if(this.aType == 2){
      texture(ast2);
    }
    if(this.aType == 3){
      texture(ast3);
    }
    this.px1 = this.xpos  +  this.size*sqrt(2)*cos(this.astR);
    this.py1 = this.ypos  +  this.size*sqrt(2)*sin(this.astR);
    this.px2 = this.xpos  +  this.size*sqrt(2)*cos(this.astR+PI/2);
    this.py2 = this.ypos  +  this.size*sqrt(2)*sin(this.astR+PI/2);
    this.px3 = this.xpos  +  this.size*sqrt(2)*cos(this.astR+PI);
    this.py3 = this.ypos  +  this.size*sqrt(2)*sin(this.astR+PI);
    this.px4 = this.xpos  +  this.size*sqrt(2)*cos(this.astR+3*PI/2);
    this.py4 = this.ypos  +  this.size*sqrt(2)*sin(this.astR+3*PI/2);
    vertex(this.px1,this.py1, 0, 0);
    vertex(this.px2,this.py2, 600, 0);
    vertex(this.px3,this.py3, 600, 600);
    vertex(this.px4,this.py4, 0, 600);
    endShape();
  }
}

//Calculates high score
function Record(){
  var r = scores[0];
  for (var i = 1; i < scores.length; i++) {
    if (scores[i] > r) {
      r = scores[i];
    }
  }
  if (Score > r){
    r = Score;
  }
  return r;
}


//Amo Class
class Amo {
  constructor( i1,  i2,  i3,  i4,  i5,  i6,  i7,  i8) {
    this.size = i1;
    this.velAmo = i2;
    this.aDir = i3;
    this.colora = i4;
    this.colorb = i5;
    this.colorc = i6;
    this.startx = i7;
    this.starty = i8;
    this.xpos = 0;
    this.ypos = 0;
    this.movement = 0;
  }
  //Constantly moves in a direction
  update() {
    this.xpos = this.startx + this.movement * cos(this.aDir);
    this.ypos = this.starty + this.movement * sin(this.aDir);
    this.movement += this.velAmo;
    //Resets asteroid if it gets hit by amo
    for (var i = 0; i<rocks.length; i++) {
      if (sqrt(pow(rocks[i].xpos-this.xpos,2)+pow(rocks[i].ypos-this.ypos,2))<this.size+rocks[i].size){
        numAstShot++;
        rocks[i].movement = 0;
        var ran = floor(random(1,5));
        if(ran==1){
          rocks[i].startx = random(1,width-1);
          rocks[i].starty = 1;
        }
        if(ran==2){
          rocks[i].startx = random(1,width-1);
          rocks[i].starty = height-1;
        }
        if(ran==3){
          rocks[i].startx = 1;
          rocks[i].starty = random(1,height-1);
        }
        if(ran==4){
          rocks[i].startx = width-1;
          rocks[i].starty = random(1,height-1);
        }
        //Essentially deletes amo when it hits an asteroid
        this.size = 0;
        this.velAmo = 0;
        this.aDir = 0;
        this.colora = 0;
        this.colorb = 0;
        this.colorc = 0;
        this.startx = 0;
        this.starty = 0;
        this.xpos = 0;
        this.ypos = 0;
      }
    }
  }
  display() {
    fill(this.colora,this.colorb,this.colorc);
    ellipse(this.xpos,this.ypos,this.size,this.size);
  }
}
