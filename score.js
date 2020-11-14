const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

let score = 0;
// let highScore = localStorage.getItem('highScore') || 0;

export function updateScore() {
  score++;
}

export function draw() {
  scoreElement.innerText = `Score: ${score}`;
  // highScoreElement.innerText = `High Score: ${highScore}`;
}

export function checkForNewHighScore() {
  if (score > highScore) {
    // localStorage.setItem('highScore', score);
  }
}

export function getScore() {
  return score;
}
