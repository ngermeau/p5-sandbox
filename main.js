function setup() {
  createCanvas(2000, 2000)
}

function draw() {
  background("#151515")
  for (let i = 0; i < 900; i += 5) {
    ellipse(i, i, i, i)
  }
}
