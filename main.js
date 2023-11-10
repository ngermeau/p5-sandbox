
let config = {
  //sketch
  sketchWidth: 1000,
  sketchHeight: 1000,
  cellSize: 15,

  //Speed
  frameRate: 60,

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
  strokeWeightMax: 12,
  colors: ["f8f9fa","e9ecef","dee2e6","ced4da","adb5bd","6c757d","495057","343a40","212529"]
}

var cycling = 0
var cycleSpeed = 40
var livingCells = new Set()
var livingCellsConfig= new Map()
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class CellConfig {
  constructor() {
    this.size = config.initialSize;
    this.shouldGrow = true;

    this.thresholdSize = getRandomInt(this.size, config.thresholdSizeMax);
    this.finalSize = getRandomInt(config.finalSizeMin,config.finalSizeMax);
    this.speedOfGrowth = getRandomInt(config.speedOfGrowthMin,config.speedOfGrowthMax);

    this.strokeColor = config.colors[getRandomInt(0,config.colors.length -1)];
    this.strokeWeight = getRandomInt(config.strokeWeightMin, config.strokeWeightMax);
  }

  updateSize() {
    if (this.shouldGrow) {
      this.size = this.size + this.speedOfGrowth;
      if (this.size >= this.thresholdSize) this.shouldGrow = false;
    } else if (this.size > this.finalSize) {
      this.size = this.size - this.speedOfGrowth;
    }
  }
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  // livingCells.add(cantor(1, 1))
  // livingCells.add(cantor(2,1))
  // livingCells.add(cantor(3,1))
  frameRate(config.frameRate)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function cycle(){
  cycling++
  if (cycleSpeed != 0 && cycling % cycleSpeed != 0) return;
  cycling = 0
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
  let newLivingCellsConfig = new Map()
  let deadCells = neighboursDeadCells()

  livingCells.forEach((cell) => {
    let nbrOfAliveNeighbours = aliveNeighbours(cell).size
    if (nbrOfAliveNeighbours === 2 || nbrOfAliveNeighbours === 3) {
      newLivingCells.add(cell)
      newLivingCellsConfig.set(cell, new CellConfig())
    }
  })

  deadCells.forEach((cell) => {
    let nbrOfAliveNeighbours = aliveNeighbours(cell).size
    if (nbrOfAliveNeighbours === 3){
        newLivingCells.add(cell)
        newLivingCellsConfig.set(cell, new CellConfig())
    }
  })

  livingCells = newLivingCells
  livingCellsConfig = newLivingCellsConfig
}
function displayCell(cell){
  let {x,y} = uncantor(cell)
  let cellConfig = livingCellsConfig.get(cell)
  strokeWeight(cellConfig.strokeWeight);
  stroke("#" + cellConfig.strokeColor);
  noFill()
  cellConfig.updateSize()
  ellipse(x * config.cellSize, y * config.cellSize, cellConfig.size, cellConfig.size);
}

function draw() {
  background(config.backgroundColor)
  livingCells.forEach(cell => displayCell(cell))
  cycle()
}
function mouseDragged() {
  let x = Math.round(mouseX/config.cellSize);
  let y = Math.round(mouseY/config.cellSize);
  let cell = cantor(x,y)
  livingCells.add(cell);
  livingCellsConfig.set(cell,new CellConfig())
}

function mouseWheel(event) {
  // cycleSpeed -= round(event.delta);
  console.log(cycleSpeed)
}
