import { getInputDirection } from './input.js';

export const SNAKE_SPEED = 9;
let snakeBody = [{ x: 11, y: 11 }];
const EXPANSION_RATE = 1;
let newSnakeElements = 0;

export function update() {
  addNewSegments();
  const inputDirection = getInputDirection();

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = { ...snakeBody[i - 1] };
  }

  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
}

export function draw(gameBoard) {
  snakeBody.forEach(segment => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add('snake');

    gameBoard.appendChild(snakeElement);
  });
}

export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false;
    return equalPosition(position, segment);
  });
}

export function expandSnake() {
  newSnakeElements += EXPANSION_RATE;
}

export function getSnakeHead() {
  return snakeBody[0];
}

export function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addNewSegments() {
  for (let i = newSnakeElements; i > 0; i--) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSnakeElements = 0;
}
