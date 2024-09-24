import React from 'react';
import { BoardCell } from '../utils/boardUtils';

interface BoardGridProps {
  board: BoardCell[];
  squareSize: number;
  boardSize: number;
  isRightBoard?: boolean;
  onCellClick?: (index: number) => void;
  selectedCells: Set<number>;
}

const BoardGrid: React.FC<BoardGridProps> = ({ 
  board, 
  squareSize, 
  boardSize, 
  isRightBoard, 
  onCellClick,
  selectedCells
}) => {
  const handleCellClick = (index: number) => {
    if (isRightBoard && onCellClick) {
      onCellClick(index);
    }
  };

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
      }}
    >
      {board.map((cell, index) => (
        <div
          key={index}
          id={isRightBoard ? `right-cell-${index}` : undefined}
          className={`cell ${selectedCells.has(index) ? 'pulse-magenta' : ''}`}
          style={{
            width: squareSize,
            height: squareSize,
            backgroundColor: cell.color,
            border: '1px solid black',
          }}
          onClick={() => handleCellClick(index)}
        />
      ))}
    </div>
  );
};

export default BoardGrid;