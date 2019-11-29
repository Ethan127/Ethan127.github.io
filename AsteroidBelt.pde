/* @pjs preload="Images/Background.png, Images/a1.png, Images/a2.png, Images/a3.png, Images/rocketwithoutflame.png, Images/rocket.png"; */

float moveX, centerX, X, velX, angle, aimR, mass, rectSL, moveY, centerY, Y, velY, seconds, timeElapsed, startTime, TOD, record;
PImage backgroundI, rocket, ast1, ast2, ast3;
boolean keyW, keyA, keyS, keyD, alive;
String rocketImage, rocketImage2;
int numAst, timesDied, numAmo, amoNum, Score, numAstShot;
Asteroid[] rocks;
Amo[] bullets;
float[] scores;

//Determines angle based on vector (x and y values) using inverse tangent
float theA(float x, float y){
  float tAngle = 0;
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

void setup() { 
  backgroundI = loadImage("Images/Background.png");
  ast1 = loadImage("Images/a1.png");
  ast2 = loadImage("Images/a2.png");
  ast3 = loadImage("Images/a3.png");
  size(960, 540, P2D); 
  noStroke();
  rectMode(CENTER);
  
  //Sets starting values for variables
  rocketImage = "Images/rocketwithoutflame.png";
  rocketImage2 = "Images/rocket.png";
  rocket = loadImage(rocketImage);
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
  
  //Array of every score
  scores = new float[500];
  
  //Array of amo
  bullets = new Amo[numAmo];
  for (int x = 0; x < numAmo; x++) {
    bullets[x] = new Amo(0,0,0,0,0,0,0,0);
  }
}

//Partially setups the game
void partialSetup(){
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
  rocks = new Asteroid[numAst];
  int index = 0;
  for (int x = 0; x < numAst; x++) {
    rocks[index++] = new Asteroid(random(10,20), random(0,5), random(0,2*PI), random(255), random(255), random(255), random(width), random(height), floor(random(1,4)), random(-0.1,0.1));
  }
}

void mouseClicked(){
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

void draw() {
  //Checks time passed
  timeElapsed = millis() - startTime - TOD;
  seconds = timeElapsed / 1000;
  
  //Score keeper
  Score = (round(timeElapsed) + 1000*numAstShot)/10;
  
  //Sets background to space image
  background(backgroundI);
  
  //Updates location of rocks and amo
  for (Asteroid rock : rocks) {
    rock.update();
    rock.display();
  }
  for (Amo bullet : bullets) {
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
  float a1 = centerX  +  rectSL*sqrt(2)*cos(angle);
  float b1 = centerY  +  rectSL*sqrt(2)*sin(angle);
  float a2 = centerX  +  rectSL*sqrt(2)*cos(angle+PI/2);
  float b2 = centerY  +  rectSL*sqrt(2)*sin(angle+PI/2);
  float a3 = centerX  +  rectSL*sqrt(2)*cos(angle+PI);
  float b3 = centerY  +  rectSL*sqrt(2)*sin(angle+PI);
  float a4 = centerX  +  rectSL*sqrt(2)*cos(angle+3*PI/2);
  float b4 = centerY  +  rectSL*sqrt(2)*sin(angle+3*PI/2);
  
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
  int minute = floor(seconds / 60);
  int second = floor(seconds % 60);
  float velocity = sqrt(velX*velX+velY*velY);
  float rAngle = 360 - theA(mouseX-centerX, mouseY-centerY)*180/PI;
  float vAngle = 360 - theA(velX, velY)*180/PI;
  
  String s1 = "Velocity: " + velocity + "m/s";
  String s2 = "Angle of velocity: " + vAngle + "\u00b0";
  String s3 = "Angle of rotation: " + rAngle + "\u00b0";
  String s4 = "You have survived " + minute + " minutes and " + second + " seconds.";
  String s5 = "Your high score is " + round(Record());
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
  String game;
  String survival;
  String mess;
  int gameTrans;
  String highScore;
  String s6;
  if(alive==false){
    survival = "You survived for " + minute + " minutes and " + second + " seconds.";
    game = "Game Over";
    mess = "Just click your mouse to retry.";
    gameTrans = 200;
    s6= "";
    highScore = "Score: " + Integer.toString(Score);
  }else{
    s6 = "Score: " + Integer.toString(Score);
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
void keyPressed() {
    if (key == 'a') {
      keyA = true;
    } else if (key == 'd') {
      keyD = true;
    }else if (key == 'w') {
      keyW = true;
      rocket = loadImage(rocketImage2);
    }else if (key == 's') {
      keyS = true;
    }
}
void keyReleased() {
    if (key == 'a') {
      keyA = false;
      rocket = loadImage(rocketImage);
    } else if (key == 'd') {
      keyD = false;
      rocket = loadImage(rocketImage);
    }else if (key == 'w') {
      keyW = false;
      rocket = loadImage(rocketImage);
    }else if (key == 's') {
      keyS = false;
      rocket = loadImage(rocketImage);
    }
}

//Asteroid Class
class Asteroid {
  float size;
  float velA;
  float aDir;
  float colora;
  float colorb;
  float colorc;
  float xpos;
  float ypos;
  float startx;
  float starty;
  float movement;
  int aType;
  float astRot;
  float astR;
  //Contructor
  Asteroid(float i1, float i2, float i3, float i4, float i5, float i6, float i7, float i8, int i9, float i10) {
    size = i1;
    velA = i2;
    aDir = i3;
    colora = i4;
    colorb = i5;
    colorc = i6;
    startx = i7;
    starty = i8;
    aType = i9;
    astRot = i10;
    xpos = 0;
    ypos = 0;
    astR = 0;
  }
  //Constantly moves in a direction
  void update() {
    xpos = startx + movement * cos(aDir);
    ypos = starty + movement * sin(aDir);
    astR = astR + astRot;
    movement += velA;
    //Resets position if it goes to an edge
    if (xpos <= 0 || xpos >= width || ypos <= 0 || ypos >= height){
      movement = 0;
      int ran = floor(random(1,5));
      if(ran==1){
        startx = random(1,width-1);
        starty = 1;
      }
      if(ran==2){
        startx = random(1,width-1);
        starty = height-1;
      }
      if(ran==3){
        startx = 1;
        starty = random(1,height-1);
      }
      if(ran==4){
        startx = width-1;
        starty = random(1,height-1);
      }
    }
    //If the rocket collides with an asteroid, you die
    if (sqrt(pow((centerX - xpos),2)+pow((centerY - ypos),2))<=(size+sqrt(2)*rectSL/2)){
      alive = false;
      noLoop();
      TOD = millis() - startTime;
      timesDied++;
      scores[timesDied] = Score;
      death.play();
    }
  }
  //Actually makes the asteroids
  void display() {
    fill(colora,colorb,colorc);
    beginShape();
    if(aType == 1){
      texture(ast1);
    }
    if(aType == 2){
      texture(ast2);
    }
    if(aType == 3){
      texture(ast3);
    }
    float px1 = xpos  +  size*sqrt(2)*cos(astR);
    float py1 = ypos  +  size*sqrt(2)*sin(astR);
    float px2 = xpos  +  size*sqrt(2)*cos(astR+PI/2);
    float py2 = ypos  +  size*sqrt(2)*sin(astR+PI/2);
    float px3 = xpos  +  size*sqrt(2)*cos(astR+PI);
    float py3 = ypos  +  size*sqrt(2)*sin(astR+PI);
    float px4 = xpos  +  size*sqrt(2)*cos(astR+3*PI/2);
    float py4 = ypos  +  size*sqrt(2)*sin(astR+3*PI/2);
    vertex(px1,py1, 0, 0);
    vertex(px2,py2, 600, 0);
    vertex(px3,py3, 600, 600);
    vertex(px4,py4, 0, 600);
    endShape();
  }
}

//Calculates high score
float Record(){
  float r = scores[0];
  for (int i = 1; i < scores.length; i++) {
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
  float size;
  float velAmo;
  float aDir;
  float colora;
  float colorb;
  float colorc;
  float xpos;
  float ypos;
  float startx;
  float starty;
  float movement;
  //Contructor
  Amo(float i1, float i2, float i3, float i4, float i5, float i6, float i7, float i8) {
    size = i1;
    velAmo = i2;
    aDir = i3;
    colora = i4;
    colorb = i5;
    colorc = i6;
    startx = i7;
    starty = i8;
    xpos = 0;
    ypos = 0;
  }
  //Constantly moves in a direction
  void update() {
    xpos = startx + movement * cos(aDir);
    ypos = starty + movement * sin(aDir);
    movement += velAmo;
    //Resets asteroid if it gets hit by amo
    for (int i = 0; i<rocks.length; i++) {
      if (sqrt(pow(rocks[i].xpos-this.xpos,2)+pow(rocks[i].ypos-this.ypos,2))<this.size+rocks[i].size){
        numAstShot++;
        rocks[i].movement = 0;
        int ran = floor(random(1,5));
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
  void display() {
    fill(colora,colorb,colorc);
    ellipse(xpos,ypos,size,size);
  }
}
