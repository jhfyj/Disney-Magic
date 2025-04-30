// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */
let video;
let stars = [];
let asteroid = [];
let laser = [];
let poseNet;
let poses = [];
let prevRightWrist = null;
let prevLeftWrist = null;
let handLasers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4});
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  
   // Create initial stars
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(-width, width),
      y: random(height),
      size: random(3, 6),
      size2: random(1, 3),
      speed: random(1, 3)
    });
  }
  
  // Create asteroids
  for (let i = 0; i < 5; i++) {
    asteroid.push({
      x: random(-width, width),
      y: random(height),
      r: random(6, 10),
      speed: random(1, 3)
    });
  }
  
  // Create lasers
  let colors = [color(255, 0, 0, 100), color(0, 255, 0, 100), color(0, 0, 255, 150)];
  for (let i = 0; i < 3; i++) {
    laser.push({
      length: 0,
      x: random(-width, width),
      y: random(height),
      r: random(1, 4),
      speed: random(1, 3),
      f: random(colors),
      growing: true
    });
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

function draw() {
  translate(video.width, 0);
  scale(-1,1)
  image(video, 0, 0, width, height);
  strokeWeight(2);
  
  background(0, 0, 250, 120); 
  
  noStroke();
  
  for (let star of stars) {
    fill("#FBF5C0");
    ellipse(star.x, star.y, star.size, star.size2);
    star.x += star.speed;
    if (star.x > width) {
      star.x = -star.size;
      star.y = random(height);
    }
  }
  
  for (let a of asteroid) {
    fill(50);
    circle(a.x, a.y, a.r);
    fill(80);
    circle(a.x - 3, a.y + 3, a.r - 1);
    fill(90);
    circle(a.x + 3, a.y + 3, a.r - 1.5);
    a.x += a.speed;
    if (a.x > width) {
      a.x = -a.r;
      a.y = random(height);
    }
  }
  
  // Update and draw fading, growing hand lasers
  for (let i = handLasers.length - 1; i >= 0; i--) {
    let l = handLasers[i];
    noStroke();
    fill(l.color.levels[0], l.color.levels[1], l.color.levels[2], l.alpha);
    rect(l.x, l.y, l.length, l.r);
    
    l.x += l.speed;
    
    if (l.growing) {
      l.r += 0.3;
      l.length += 8;
      if (l.r >= 4) l.growing = false;
    } else {
      l.r -= 0.05;
      if (l.r <= 0.5) l.r = 0.5;
    }

    l.alpha -= 4;

    if (l.alpha <= 0 || l.x > width) {
      handLasers.splice(i, 1);
    }
  }

  // Main laser effect (unchanged)
  for (let l of laser) {
    noStroke();
    fill(l.f);
    rect(l.x, l.y, l.length, l.r);
    l.x += l.speed;

    if (l.growing) {
      l.r += 0.5; 
      l.length -= 5;
      if (l.r >= 4) {
        l.growing = false; 
      }
    } else {
      l.r -= 0.05; 
      l.length += 5;
      if (l.r <= 0) {
        l.length = 0;
        l.growing = true; 
      }
    }

    if (l.x > width) {
      l.x = -150; 
      l.y = random(height);
      l.r = 0; 
      l.growing = true; 
      fill(l.f);
    }
  }

  // Hand movement triggers horizontal laser
  if (poses.length > 0) {
    const pose = poses[0].pose;
    const threshold = 25;

    const right = pose.rightWrist;
    const left = pose.leftWrist;

    if (prevRightWrist) {
      let dx = dist(right.x, right.y, prevRightWrist.x, prevRightWrist.y);
      if (dx > threshold) {
        handLasers.push({
          x: right.x,
          y: right.y,
          alpha: 255,
          speed: 5,
          length: 0,
          r: 1,
          growing: true,
          color: color(255, 0, 0)
        });
      }
    }

    if (prevLeftWrist) {
      let dx = dist(left.x, left.y, prevLeftWrist.x, prevLeftWrist.y);
      if (dx > threshold) {
        handLasers.push({
          x: left.x,
          y: left.y,
          alpha: 255,
          speed: 5,
          length: 0,
          r: 1,
          growing: true,
          color: color(0, 255, 0)
        });
      }
    }

    prevRightWrist = { x: right.x, y: right.y };
    prevLeftWrist = { x: left.x, y: left.y };
  }
}


function laserh(x,y){
  strokeWeight(5)
  line(x,y,x+random(-100,100),y+random(-100,100))
  
}