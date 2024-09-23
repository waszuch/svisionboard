export const getRandomColor = (): string => {
  const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateBoards = (size: number) => {
  const newLeftBoard: BoardCell[] = [];
  const newRightBoard: BoardCell[] = [];
  const differences = new Set<string>();

  while (differences.size < 4) {
    const diffX = Math.floor(Math.random() * size);
    const diffY = Math.floor(Math.random() * size);
    differences.add(`${diffX},${diffY}`);
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = getRandomColor();
      newLeftBoard.push({ color: color, border: 'none' });
      if (differences.has(`${x},${y}`)) {
        let differentColor;
        do {
          differentColor = getRandomColor();
        } while (differentColor === color);
        newRightBoard.push({ color: differentColor, border: 'none' });
      } else {
        newRightBoard.push({ color: color, border: 'none' });
      }
    }
  }

  return { newLeftBoard, newRightBoard, differences };
};export interface BoardCell {
  color: string;
  border: string;
  zIndex?: number;
}