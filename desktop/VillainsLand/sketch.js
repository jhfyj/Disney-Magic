// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
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
  background(75,240,75,30)
  
  if (poses.length > 0) {
    const pose = poses[0].pose;
    
    const rightWrist = pose.rightWrist;
    flame(rightWrist.x, rightWrist.y-60);

    
    const leftWrist = pose.leftWrist;
    flame(leftWrist.x, leftWrist.y-60);
    
    
  }
}


function flame(x,y){
  
  fill("rgb(8,179,48)")
  noStroke()
  circle(x,y+5,75)
  triangle(x-37.5,y+5,x-30,y-75,x,y)
  triangle(x+37,y+5,x+40,y-77.5,x,y)
  triangle(x-37.3,y,x,y-95,x+32.5,y)
  
  fill("#6CC00B")
  circle(x,y,60)
  triangle(x-30,y,x-25,y-65,x,y)
  triangle(x+30,y,x+25,y-62,x,y)
  
  
  color("rgb(45,251,45)")
  fill(45,251,45)
  circle(x,y+5,40)
  triangle(x-20,y+2.5,x,y-50,x+20,y+2.5)
  
  fill(45,251,45)
  ellipse(x-20,y-80,5,14)
  ellipse(x+20,y-100,5,12)
  ellipse(x-50,y-30,3,10)
  ellipse(x+50,y-60,3,10)
  ellipse(x+50,y-20,3,10)
  
  
}

