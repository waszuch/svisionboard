export const getRandomColor = (): string => {
    const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  export const generateBoards = (size: number) => {
    const newLeftBoard: string[] = [];
    const newRightBoard: BoardCell[] = [];
    const newDiffX = Math.floor(Math.random() * size);
    const newDiffY = Math.floor(Math.random() * size);
  
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const color = getRandomColor();
        newLeftBoard.push(color);
        if (x === newDiffX && y === newDiffY) {
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
  
    return { newLeftBoard, newRightBoard, newDiffX, newDiffY };
  };
  
  export interface BoardCell {
    color: string;
    border: string;
    zIndex?: number;
  }