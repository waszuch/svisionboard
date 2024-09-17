import React from 'react';

interface BoardCell {
    color: string;
    border: string;
    zIndex?: number;
  }


interface BoardGridProps {
  board: string[] | BoardCell[];
  squareSize: number;
  boardSize: number;
  isRightBoard?: boolean;
  onCellClick?: (index: number) => void;
}

const BoardGrid: React.FC<BoardGridProps> = ({ board, squareSize, boardSize, isRightBoard, onCellClick }) => {
  return (
    <div
      className={`grid border-3 border-black bg-gray-800`}
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
        width: `${squareSize * boardSize}px`,
        height: `${squareSize * boardSize}px`,
      }}
    >
      {board.map((cell, index) => (
        <div
          id={isRightBoard ? `right-cell-${index}` : undefined}
          key={index}
          className={`${isRightBoard ? "cell" : ""}relative`}
          style={{
            backgroundColor: typeof cell === 'string' ? cell : cell.color,
            width: squareSize,
            height: squareSize,
            border: '1px solid black',
            cursor: isRightBoard ? 'pointer' : 'default',
          }}
          onClick={isRightBoard ? () => onCellClick && onCellClick(index) : undefined}
        />
      ))}
    </div>
  );
};

export default BoardGrid;