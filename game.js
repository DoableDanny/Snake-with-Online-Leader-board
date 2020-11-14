import {
  SNAKE_SPEED,
  update as updateSnake,
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection,
} from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';
import { draw as drawScore, checkForNewHighScore, getScore } from './score.js';

const gameBoard = document.getElementById('game-board');
let lastRenderTime = 0;
let gameOver = false;

function main(currentTime) {
  if (gameOver) {
    if (
      confirm('YOU KILLED THE SNAKE! Press Enter or click OK to respawn 🐍')
    ) {
      window.location = `./?score=${getScore()}`;
    }
    return;
  }

  window.requestAnimationFrame(main);

  let secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;

  if (secondsSinceLastRender >= 1 / SNAKE_SPEED) {
    update();
    draw();
    lastRenderTime = currentTime;
  }
}

window.requestAnimationFrame(main);

function update() {
  checkDeath();
  updateSnake();
  updateFood();
}

function draw() {
  gameBoard.innerHTML = '';
  drawSnake(gameBoard);
  drawFood(gameBoard);
  drawScore(gameBoard);
}

function checkDeath() {
  if (outsideGrid(getSnakeHead()) || snakeIntersection()) {
    gameOver = true;
    checkForNewHighScore();
  }
}
