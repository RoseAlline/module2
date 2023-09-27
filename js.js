import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.getElementById("game-board");
const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i;
let moveStartX, moveStartY;

moveStartX = event.clientX;
moveStartY = event.clientY;
        
let moveEndX = event.clientX;
let moveEndY = event.clientY;

var dx = moveEndX - moveStartX;
var dy = moveEndY - moveStartY;
var absDx = Math.abs(dx);
var absDy = Math.abs(dy);
    


const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();


function setupInputOnce() {
  window.addEventListener("keydown", handleInput, { once: true });
  window.addEventListener("mousedown", handleInput, { once: true });
  window.addEventListener("wheel", handleInput, { once: true });
  gameBoard.addEventListener("touchstart", handleInput, { once: true });
  gameBoard.addEventListener("touchend", handleInput, { once: true });
}

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('touch', event => event.preventDefault());



async function handleInput(event) {
  switch (event.key || event.button || event.deltaY || event.clientX || event.clientY) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft": 
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight": 
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();
      break;
    default:
      if (event.deltaY > 0) {
        if (!canMoveUp()) {
          setupInputOnce();
          return;
        }
        await moveUp();
        break;
      } else if (event.deltaY < 0) {
        if (!canMoveDown()) {
          setupInputOnce();
          return;
        }
        await moveDown();
        break;
      }
      if (event.button === 0) {
        if (!canMoveLeft()) {
          setupInputOnce();
          return;
        }
        await moveLeft();
        break;
      } else if (event.button === 2) {
        if (!canMoveRight()) {
          setupInputOnce();
          return;
        }
        await moveRight();
        break;
      }
         if (start(event.touches) > 0 & absDx > absDy) { 
          if (!canMoveRight()) {
          setupInputOnce();
          return;
        }
        await moveRight();
        break;
      } else if (start(event.touches) < 0 & absDx > absDy) {
        if (!canMoveLeft()) {
          setupInputOnce();
          return;
        }
        await moveLeft();
        break;
      }
      if (start(event.touches) < 0 & absDx < absDy) {
        if (!canMoveUp()) {
          setupInputOnce();
          return;
        }
        await moveUp();
        break;
      } else if (start(event.touches) > 0 & absDx < absDy) {
        if (!canMoveDown()) {
          setupInputOnce();
          return;
        }
        await moveDown();
        break;
      }
        
      setupInputOnce();
      return;
      
  }

  
  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd()
    alert("Try again!")
    return;
  }


  setupInputOnce();

}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
}

async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);
  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles()
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}
