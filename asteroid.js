var moveX, centerX, X, velX, angle, aimR, mass, rectSL, moveY, centerY, Y, velY, AmoV, seconds, timeElapsed, startTime, TOD, record;
var backgroundI, rocket, ast1, ast2, ast3, rocketImage, rocketImage2, myFont;
var keyW, keyA, keyS, keyD, alive, cheats, safetyRad;
var numAst, timesDied, numAmo, amoNum, Score, numAstShot, rockPos;
var rocks, bullets;
var scores;
var music, rocketSound, death, gun;

function preload() {
  ast1 = loadImage("assets/a1.png");
  ast2 = loadImage("assets/a2.png");
  ast3 = loadImage("assets/a3.png");
  rocket = loadImage("assets/rocketwithoutflame.png");
  rocket1 = loadImage("assets/rocketwithoutflame.png");
  rocket2 = loadImage("assets/rocket.png");
  backgroundI = loadImage("assets/Background.png");
  myFont = loadFont("/assets/montserrat/Montserrat-Bold.otf");
  music = loadSound('assets/Sounds/music.mp3');
  rocketSound = loadSound('assets/Sounds/rocket.mp3');
  death = loadSound('assets/Sounds/boom.mp3');
  gun = loadSound('assets/Sounds/laser.wav');
}

//Determines angle based on vector (x and y values) using inverse tangent
function theAngle(x, y){
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

rockPos=[0,0];
function randPos(){
  let x = random(-width/2,width/2);
  let y = random(-height/2,height/2);
  if (sqrt(pow(x,2) + pow(y,2)) >= safetyRad){
    rockPos[0]=x;
    rockPos[1]=y;
    break;
  } else {
    randPos();
  }
}

//Partially setups the game
function partialSetup(){
  //Sets starting values for variables
  moveX = 0;
  moveY = 0;
  centerX = 0;
  centerY = 0;
  X = 0;
  Y = 0;
  velX = random(-1,1);
  velY = random(-1,1);
  aimR = 0;
  Score = 0;
  numAstShot = 0;
  
  //An array of rocks
  rocks = new Array(numAst);
  for (let x = 0; x < numAst; x++) {
    randPos();
    rocks[x] = new Asteroid(random(10,20), random(0,5), random(0,2*PI), random(255), random(255), random(255), rockPos[0], rockPos[1], floor(random(1,4)), random(-0.1,0.1), x);
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
  numAst = 45;
  AmoV = 12;
  cheats=false;
  safetyRad=50;
  numAmo = 10; //Highest number of bullets on screen at once

  //Plays music
  music.loop(1,0.5);
  
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

//Calculates high score
function Record(){
  var r = scores[1];
  for (var i = 1; i < scores.length; i++) {
    if (scores[i] > r) {
      r = scores[i];
    }
  }
  if (Score > r || isNaN(r)){
    r = Score;
  }
  return r;
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
    gun.play();
    amoNum++;
    bullets[amoNum] = new Amo(5, AmoV, angle, random(255), random(255), random(255), centerX, centerY);
    if (amoNum == numAmo-1){
      amoNum = 0;
    }
  }
}

function draw() {
  //Background
  rectMode(CENTER);
  texture(backgroundI);
  rect(0, 0, width, height)
  rectMode(CORNER);

  //Checks time passed
  timeElapsed = millis() - startTime - TOD;
  seconds = timeElapsed / 1000;
  
  //Score keeper
  Score = round((timeElapsed + 1000*numAstShot)/10);
  
  //Updates location of rocks and amo
  for (const rock of rocks) {
    rock.collision();
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
  angle = theAngle((mouseX-width/2)-centerX, (mouseY-height/2)-centerY);
  
  //Translates space ship around unless it's on an edge
  moveX = moveX + velX/mass;
  moveY = moveY + velY/mass;
  centerX = X+moveX;
  centerY = Y+moveY;
  //Loops position back around
  if (centerX <= -width/2 || centerY <= -height/2 || centerX >= width/2 || centerY >= height/2){
    moveX = 0;
    moveY = 0;
    Y = -centerY;
    X = -centerX;
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
  var rAngle = 360 - theAngle((mouseX-width/2)-centerX, (mouseY-height/2)-centerY)*180/PI;
  var vAngle = 360 - theAngle(velX, velY)*180/PI;
  
  var s1 = "Velocity: " + velocity + "m/s";
  var s2 = "Angle of velocity: " + vAngle + "\u00b0";
  var s3 = "Angle of rotation: " + rAngle + "\u00b0";
  var s4 = "You have survived " + minute + " minutes and " + second + " seconds.";
  var s5 = "Your high score is " + round(Record());
  textSize(15);
  fill(255,255,0);
  rectMode(CENTER);

  text(s1, -350, 25-height/2, 420, 50); 
  text(s2, 0, 25-height/2, 420, 50); 
  text(s3, 350, 25-height/2, 420, 50); 
  text(s4, 0, 75-height/2, 420, 50);

  fill(66, 200, 244);
  text(s5, 0, height/2-20, 250, 50);
  
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
  rect(0, 50, 300, 125, 15);
  textSize(50);
  fill(0,0,0, 255);
  text(game, 0-143, 0);
  textSize(25);
  text(survival, 0-250, 0+100);
  textSize(18);
  text(mess, 0-145, 0+150);
  rectMode(CENTER);
  textSize(25);
  fill(66, 200, 244);
  text(s6, 10, height/2-50, 250, 60);
  fill(0, 0, 0, 255);
  rectMode(CENTER);
  text(highScore, 0, 0+60, 200, 50);
  rectMode(CORNER); 
}


//Key press events
function keyPressed() {
    if (key == 'a') {
      keyA = true;
      rocketSound.play();
    } else if (key == 'd') {
      keyD = true;
      rocketSound.play();
    }else if (key == 'w') {
      keyW = true;
      rocketSound.play();
      rocket = rocket2;
    }else if (key == 's') {
      keyS = true;
      rocketSound.play();
    }
}
function keyReleased() {
    if (key == 'a') {
      keyA = false;
      rocketSound.stop();
      rocket = rocket1;
    } else if (key == 'd') {
      keyD = false;
      rocketSound.stop();
      rocket = rocket1;
    }else if (key == 'w') {
      keyW = false;
      rocketSound.stop();
      rocket = rocket1;
    }else if (key == 's') {
      keyS = false;
      rocketSound.stop();
      rocket = rocket1;
    }
}

//Asteroid Class
class Asteroid {
  //Contructor
  constructor( i1,  i2,  i3,  i4,  i5,  i6,  i7,  i8,  i9,  i10, i11) {
    this.size = i1;
    this.velA = i2;
    this.aDir = i3;
    this.xpos = i7;
    this.ypos = i8;
    this.aType = i9;
    this.astRot = i10;
    this.index = i11;
    this.indexPrevCol = -1;
    this.astR = 0;
    this.px1 = 0;
    this.py1 = 0;
    this.px2 = 0;
    this.py2 = 0;
    this.px3 = 0;
    this.py3 = 0;
    this.px4 = 0;
    this.py4 = 0;
  }
  get v() {
    return [this.velA*cos(this.aDir), this.velA*sin(this.aDir)];
  }
  //Constantly moves in a direction
  update() {
    this.xpos += this.velA * cos(this.aDir);
    this.ypos += this.velA * sin(this.aDir);
    this.astR = this.astR + this.astRot;
    //Resets position if it goes to an edge
    if (this.xpos <= -width/2 || this.xpos >= width/2 || this.ypos <= -height/2 || this.ypos >= height/2){
      this.xpos = -this.xpos+this.velA * cos(this.aDir);
      this.ypos = -this.ypos+this.velA * sin(this.aDir);
    }
    //If the rocket collides with an asteroid, you die
    if (sqrt(pow((centerX - this.xpos),2)+pow((centerY - this.ypos),2))<=(this.size+sqrt(2)*rectSL/2) && !cheats){
      alive = false;
      noLoop();
      TOD = millis() - startTime;
      timesDied++;
      scores[timesDied] = Score;
      death.play();
    }
  }
  //Collision detector
  collision() {
    for(const other of rocks){
      if(sqrt(pow((other.xpos - this.xpos),2)+pow((other.ypos - this.ypos),2))<=(this.size+other.size) && other!=this && other.index!=this.indexPrevCol){
        this.indexPrevCol = other.index;
        other.indexPrevCol = this.index;

        //From https://en.wikipedia.org/wiki/Elastic_collision
        let m1 = PI*this.size*this.size;
        let m2 = PI*other.size*other.size;

        let veldiff = [this.v[0]-other.v[0],this.v[1]-other.v[1]];
        let posdiff = [this.xpos-other.xpos,this.ypos-other.ypos];

        let factor = (veldiff[0]*posdiff[0] + veldiff[1]*posdiff[1]) / (posdiff[0]*posdiff[0] + posdiff[1]*posdiff[1]);
        let factor1 = 2*m2/(m1+m2)*factor;
        let factor2 = 2*m1/(m1+m2)*factor;

        let u1 = [this.v[0]-factor1*posdiff[0],this.v[1]-factor1*posdiff[1]];
        let u2 = [other.v[0]+factor2*posdiff[0],other.v[1]+factor2*posdiff[1]];

        this.aDir = theAngle(u1[0],u1[1]);
        this.velA = sqrt(pow(u1[0],2)+pow(u1[1],2));

        other.aDir = theAngle(u2[0],u2[1]);
        other.velA = sqrt(pow(u2[0],2)+pow(u2[1],2));
      }
    }
  }
  //Actually makes the asteroids
  display() {
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


//Amo Class
class Amo {
  constructor( i1,  i2,  i3,  i4,  i5,  i6,  i7,  i8) {
    this.size = i1;
    this.velAmo = i2;
    this.aDir = i3;
    this.colora = i4;
    this.colorb = i5;
    this.colorc = i6;
    this.xpos = i7;
    this.ypos = i8;
  }
  //Constantly moves in a direction
  update() {
    this.xpos += this.velAmo * cos(this.aDir);
    this.ypos += this.velAmo * sin(this.aDir);
    //Resets asteroid if it gets hit by amo
    for (let i = 0; i<rocks.length; i++) {
      if (sqrt(pow(rocks[i].xpos-this.xpos,2)+pow(rocks[i].ypos-this.ypos,2))<this.size+rocks[i].size){
        numAstShot++;
        rocks[i].xpos = 0;
        rocks[i].ypos = 0;
        let ran = floor(random(1,5));
        if(ran==1){
          rocks[i].xpos = random(1-width/2,width/2-1);
          rocks[i].ypos = 1-height/2;
        }
        if(ran==2){
          rocks[i].xpos = random(1-width/2,width/2-1);
          rocks[i].ypos = height/2-1;
        }
        if(ran==3){
          rocks[i].xpos = 1-width/2;
          rocks[i].ypos = random(1-height/2,height/2-1);
        }
        if(ran==4){
          rocks[i].xpos = width/2-1;
          rocks[i].ypos = random(1-height/2,height/2-1);
        }
        //Essentially deletes amo when it hits an asteroid
        this.size = 0;
        this.velAmo = 0;
        this.aDir = 0;
        this.colora = 0;
        this.colorb = 0;
        this.colorc = 0;
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