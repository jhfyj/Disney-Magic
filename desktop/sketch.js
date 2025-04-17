// Magical Trail Shader Conversion to JavaScript

//credit: 
//“Trail shader background for fictional googology” by Zhanwenbohttps://openprocessing.org/sketch/2434813License CreativeCommons Attribution NonCommercial NoDerivativeshttps://creativecommons.org/licenses/by-nc-nd/3.0
// credit to chatgpt for mappedX and mappedy function and recommending switching which hands to use depending on its confidence level
//credit to Dan shiffman for helping combine the video with shader texture through calling texture
//credit to ML5 for hand detection
//https://ml5js.org/



const MAX_PARTICLE_COUNT = 70;
const MAX_TRAIL_COUNT = 20;

let colorScheme = ["#E6F66", "#D22843A", "#AD8690F", "#B056BD", "#906746"];
let shaded = true;
let theShader;
let shaderTexture;
let trail = [];
let particles = [];

let video;
let video2;
let bodyPose;
let poses = [];
let connections;

let hand1, hand2;

let handTrail = [];
let handParticles = [];

let my = [];
let videoTexture;


function preload() {
  theShader = new p5.Shader(this.renderer, vertShader, fragShader);
  bodyPose = ml5.bodyPose(() => console.log("BodyPose Model Loaded"));
}

function setup() {
  pixelDensity(1);
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  canvas.canvas.oncontextmenu = () => false; // Disable right-click menu
  noCursor();

  shaderTexture = createGraphics(windowHeight*4/3, windowHeight, WEBGL);
  shaderTexture.noStroke();

  video = createCapture(VIDEO);
  video.size(windowWidth, windowWidth);
  video.hide();

  video2 = createCapture(VIDEO);
  video2.size(windowWidth, windowHeight);
  video2.hide();

  bodyPose.detectStart(video2, gotPoses);
  connections = bodyPose.getSkeleton();

  my.fullScreenBtn = createButton("?=v6 Full Screen");
  my.fullScreenBtn.mousePressed(full_screen_action);
  my.fullScreenBtn.style("font-size:42px");
}

function draw() {
  push();
  translate(-windowWidth, 0);
  scale(-1, 1); // Flip horizontally
  imageMode(CENTER);
  if(windowWidth > windowHeight*4/3){
    image(video2, -windowWidth, 0, windowWidth, windowWidth*2/3);
  }else if(windowHeight > windowWidth*2/3){
    image(video2, -windowWidth, 0, windowHeight, windowHeight *4/3);
  }
  pop();

  noStroke();

  if (poses.length > 0) {
    let pose = poses[0];

    // Draw keypoints
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();

        let mirroredX = windowWidth / 2 - keypoint.x; // Flip the x-coordinate
        // circle(mirroredX, (keypoint.y * 2) / 3 - windowWidth / 4, 10);
      }
    }

    let leftHand = pose.keypoints[9];
    let rightHand = pose.keypoints[10];

    let handToUse =
      leftHand.confidence > rightHand.confidence ? leftHand : rightHand;

    // Flip x-coordinate for the chosen hand
    //     let mirroredX = windowWidth - handToUse.x;
    //     let handPos = [mirroredX, handToUse.y];

    let mappedX = map(handToUse.x, 0, video2.width, 0, windowWidth);
    let mappedY = map(handToUse.y, 0, video2.height, 0, windowHeight);
    let mirroredX = windowWidth - mappedX;

    let handPos = [mirroredX, mappedY];

    handTrail.push(handPos);
    if (handTrail.length > MAX_TRAIL_COUNT) handTrail.splice(0, 1);

    if (handTrail.length > 1 && handParticles.length < MAX_PARTICLE_COUNT) {
      let handMove = createVector(
        handPos[0] - handTrail[handTrail.length - 2][0],
        handPos[1] - handTrail[handTrail.length - 2][1]
      );

      if (handMove.mag() > 10) {
        handMove.normalize();
        handParticles.push(
          new Particle(handPos[0], handPos[1], handMove.x, handMove.y)
        );
        // Optionally, add particles to the global particles array as well
        particles.push(
          new Particle(handPos[0], handPos[1], handMove.x, handMove.y)
        );
      }
    }

    // Move hand particles
    for (let i = handParticles.length - 1; i >= 0; i--) {
      handParticles[i].move();
      if (handParticles[i].vel.mag() < 0.1) handParticles.splice(i, 1);
    }
  }

  //   push();
  //   translate(-windowWidth, 0);
  //   scale(-1, 1); // Flip horizontally
  //   imageMode(CENTER);
  //   image(video, -windowWidth, -windowHeight/4, 640*3 , 480*3, 0, 0, windowWidth, windowHeight);
  //   fill(0, 0, 10, 100); // Semi-transparent black
  // rect(-windowWidth*3/2, -windowHeight / 2, windowWidth*2, windowHeight);
  //   pop();

  push();
  translate(-windowWidth, 0);

  // Handle general particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].move();
    if (particles[i].vel.mag() < 0.1) particles.splice(i, 1);
  }

  // Use the shader and pass data
  // if (shaded) {
    shaderTexture.shader(theShader);
    let data = serializeSketch();

    theShader.setUniform("resolution", [windowWidth, windowHeight]);
    theShader.setUniform("trail", data.trails);
    theShader.setUniform("particleCount", particles.length);
    theShader.setUniform("particles", data.particles);
    theShader.setUniform("colors", data.colors);
    theShader.setUniform("handTrailCount", handTrail.length);
    theShader.setUniform("handTrail", data.handTrails);

    shaderTexture.rect(
      windowWidth / 2,
      -windowHeight / 2,
      windowWidth,
      windowHeight
    );
    blendMode(ADD);
    texture(video);
    fill(0, 0, 0, 100);
    rect(windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);

    texture(shaderTexture);

    rect(windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
  // } else {
  //   stroke(255, 200, 0);
  //   particles.forEach((p) => point(p.pos.x, p.pos.y));
  //   stroke(0, 255, 255);
  //   trail.forEach((t) => point(t[0], t[1]));
  // }
  pop();
}

// function mousePressed() {
//   if (mouseButton === RIGHT) shaded = !shaded;
// }

function serializeSketch() {
  let data = { trails: [], particles: [], colors: [], handTrails: [] };

  handTrail.forEach((h) =>
    data.handTrails.push(
      map(h[0], 0, windowWidth, 0, 1),
      map(h[1], 0, windowHeight, 1, 0)
    )
  );

  particles.forEach((p) => {
    data.particles.push(
      map(p.pos.x, 0, windowWidth, 0, 1),
      map(p.pos.y, 0, windowHeight, 1, 0),
      (p.mass * p.vel.mag()) / 100
    );
    let col = colorScheme[p.colorIndex];
    data.colors.push(red(col), green(col), blue(col));
  });

  return data;
}

function gotPoses(results) {
  poses = results;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shaderTexture.resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowWidth);
  video2.size(windowHeight*3/2, windowHeight);

}

function full_screen_action() {
  my.fullScreenBtn.remove();
  fullscreen(1);
  let delay = 3000;
  setTimeout(ui_present_window, delay);
 // Keep square if needed
  windowResized();
}


function ui_present_window() {
  resizeCanvas(windowWidth, windowHeight);
  // init_dim();
}
