import React, { useState } from 'react';
import { BoardCell } from '../utils/boardUtils';

interface BoardGridProps {
  board: BoardCell[];
  squareSize: number;
  boardSize: number;
  isRightBoard?: boolean;
  onCellClick?: (index: number) => void;
}

const BoardGrid: React.FC<BoardGridProps> = ({ board, squareSize, boardSize, isRightBoard, onCellClick }) => {
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());

  const handleCellClick = (index: number) => {
    if (isRightBoard && onCellClick) {
      if (selectedCells.has(index)) {
        setSelectedCells(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        const cellElement = document.getElementById(`right-cell-${index}`);
        if (cellElement) {
          cellElement.classList.remove('pulse-magenta');
        }
      } else if (selectedCells.size < 5) {
        setSelectedCells(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        const cellElement = document.getElementById(`right-cell-${index}`);
        if (cellElement) {
          cellElement.classList.add('pulse-magenta');
        }
      }
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