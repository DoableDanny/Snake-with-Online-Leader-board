const GRID_SIZE = 21;

export function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1,
  };
}

export function outsideGrid(element) {
  return (
    element.x < 1 || element.x > GRID_SIZE || element.y < 1 || element.y > 21
  );
}
