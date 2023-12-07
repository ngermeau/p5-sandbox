
let config = {
  backgroundColor: 22,
}



function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(config.backgroundColor)
  square(10, 50, 50);
}

