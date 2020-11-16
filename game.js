import {
  SNAKE_SPEED,
  update as updateSnake,
  draw as drawSnake,
  getSnakeHead,
  snakeIntersection,
} from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';
import { draw as drawScore, getScore } from './score.js';

const gameBoard = document.getElementById('game-board');
let lastRenderTime = 0;
let gameOver = false;

function main(currentTime) {
  if (gameOver) {
    if (
      confirm(
        'YOU KILLED THE SNAKE! Press Enter or click OK to post score & respawn 🐍'
      )
    ) {
      postScore(getScore());
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
  }
}

function postScore(score) {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'index.php');
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send(`score=${score}`);

  xhr.onload = function () {
    window.location = './';
  };
}
