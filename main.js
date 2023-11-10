
let config = {
  //sketch
  sketchWidth: 1000,
  sketchHeight: 1000,
  cellSize: 15,

  //Speed
  frameRate: 50,

  //Init
  startUpCells: 20,

  //Grid
  backgroundColor: 22,

  //Cell
  initialSize: 1,
  thresholdSizeMax: 20,
  finalSizeMin: 1,
  finalSizeMax: 4,
  speedOfGrowthMin: 1,
  speedOfGrowthMax: 3,
  strokeWeightMin: 2,
  strokeWeightMax: 12
}

var cycling = 0
var cycleSpeed = 1
var livingCells = new Set()

function setup() {
  createCanvas(windowWidth, windowHeight);
  livingCells.add(cantor(1, 1))
  livingCells.add(cantor(2,1))
  livingCells.add(cantor(3,1))
  frameRate(10)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function cycle(){
  cycling++
  // if (cycleSpeed != 0 && cycle % cycleSpeed != 0) return;
  // cycle = 0
  calculateNextLivingCells()
}

function cantor(x,y) {
  return (0.5 * (x + y) * (x + y + 1)) + y;
}

function uncantor(z){
  let t = Math.floor((-1 + Math.sqrt(1 + 8 * z)) / 2);
  let x = t * (t + 3) / 2 - z;
  let y = z - t * (t + 1) / 2;
  return {x: x, y: y};
}

function neighbours(cell){
  let {x, y} = uncantor(cell)
  let neighbours = []

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      neighbours.push(cantor(x+i,y+j))
    }
  }
  return neighbours
}

function deadNeighbours(cell){
  let ng= neighbours(cell)
  let intersect = new Set([...ng].filter(i => !livingCells.has(i)));
  return intersect
}

function aliveNeighbours(cell){
  let ng = neighbours(cell)
  let intersect = new Set([...ng].filter(i => livingCells.has(i)));
  return intersect
}

function neighboursDeadCells() {
  let deadCells = new Set()
  livingCells.forEach(cell => {
    deadNeighbours(cell).forEach(dn => deadCells.add(dn))
  })
  return deadCells
}

function calculateNextLivingCells() {
  let newLivingCells = new Set()
  let deadCells = neighboursDeadCells()

  livingCells.forEach((cell) => {
    let nbrOfAliveNeighbours = aliveNeighbours(cell).size
    if (nbrOfAliveNeighbours === 2 || nbrOfAliveNeighbours === 3) {
      newLivingCells.add(cell)
    }
  })

  deadCells.forEach((cell) => {
    let nbrOfAliveNeighbours = aliveNeighbours(cell).size
    if (nbrOfAliveNeighbours === 3){
        newLivingCells.add(cell)
    }
  })

  livingCells = newLivingCells
}
function displayCell(cell){
  let {x,y} = uncantor(cell)

  strokeWeight(Math.random());
  stroke(230);
  noFill();
  let size = 3;
  ellipse(x * config.cellSize, y * config.cellSize, size, size);
  console.log(livingCells)
}

function draw() {
  background(config.backgroundColor)
  livingCells.forEach(cell => displayCell(cell))
  console.log("test")
  cycle()
}
function mouseDragged() {
  let x = Math.round(mouseX/config.cellSize);
  let y = Math.round(mouseY/config.cellSize);
  livingCells.add(cantor(x,y));
}
