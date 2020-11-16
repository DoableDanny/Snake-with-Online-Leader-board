const scoreElement = document.getElementById('score');

let score = 0;

export function updateScore() {
  score++;
}

export function draw() {
  scoreElement.innerText = `Score: ${score}`;
}

export function getScore() {
  return score;
}
