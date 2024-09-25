import React, { useEffect, useRef } from 'react';
import { BoardCell } from '../utils/boardUtils';

interface BoardGridProps {
  board: BoardCell[];
  squareSize: number;
  boardSize: number;
  isRightBoard?: boolean;
  onCellClick?: (index: number) => void;
  selectedCells: Set<number>;
  correctPicks: Set<number>;
}

const BoardGrid: React.FC<BoardGridProps> = ({ 
  board, 
  squareSize, 
  boardSize, 
  isRightBoard, 
  onCellClick,
  selectedCells,
  correctPicks  // Add this line
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellClick = (index: number) => {
    if (isRightBoard && onCellClick) {
      onCellClick(index);
    }
  };

  useEffect(() => {
    if (gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.pulse-magenta');
      cells.forEach(cell => {
        const htmlCell = cell as HTMLElement;
        htmlCell.classList.remove('pulse-magenta');
        void htmlCell.offsetWidth; 
        htmlCell.classList.add('pulse-magenta');
      });
    }
  }, [selectedCells]);

  return (
    <div
      ref={gridRef}
      className="grid board-grid"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
      }}
    >
      {board.map((cell, index) => (
        <div
        key={index}
    id={isRightBoard ? `right-cell-${index}` : undefined}
    className={`cell ${
      selectedCells.has(index) && !correctPicks.has(index + 1)
        ? 'pulse-magenta'
        : correctPicks.has(index + 1) && selectedCells.has(index)
        ? 'pulse-correct correct-pick'
        : ''
    }`}
    style={{
      width: squareSize,
      height: squareSize,
      backgroundColor: cell.color,
      border: '1px solid black',
    }}
    onClick={() => handleCellClick(index)}
  />
      ))}    </div>
  );
};

export default BoardGrid;