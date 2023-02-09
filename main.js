function setup() {
  createCanvas(2000, 2000)
}
let p = 200

function shape(where) {
  let ran = Math.random() * (100 - 3) + 3
  ellipse(where, p + ran, 50 + ran, 50 + ran)
  ellipse(where, p - ran, 30 - ran, 90 - ran)
  p += 0.4

}

function draw() {
  background("#151515")
  shape(700)
  shape(500)
  shape(400)
  shape(300)
  shape(200)
}
