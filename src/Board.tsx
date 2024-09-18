import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import "./style.css";
import { generateBoards, BoardCell } from './utils/boardUtils';
import BoardGrid from './components/ui/BoardGrid';
import BoardSizeDropdown from './components/ui/BoardSizeDropdown';

const Board: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(64);
  const [diffX, setDiffX] = useState<number | null>(null);
  const [diffY, setDiffY] = useState<number | null>(null);
  const [leftBoard, setLeftBoard] = useState<string[]>([]);
  const [rightBoard, setRightBoard] = useState<BoardCell[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [playerPick, setPlayerPick] = useState<number | null>(null);
  const [correctPick, setCorrectPick] = useState<number | null>(null);
  const [isDifferenceShown, setIsDifferenceShown] = useState(false);
  
  const resetGame = () => {
    setPlayerPick(null);
    setCorrectPick(null);
    setIsDifferenceShown(false);
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('pulse'));
  };
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleSquareClick = (index: number) => {
    setPlayerPick(index + 1);
  };

  const generateNewBoards = (size: number) => {
    const { newLeftBoard, newRightBoard, newDiffX, newDiffY } = generateBoards(size);
    setLeftBoard(newLeftBoard);
    setRightBoard(newRightBoard);
    setDiffX(newDiffX);
    setDiffY(newDiffY);
    
    resetGame();

   
    if (isDifferenceShown) {
      toggleDifference();  
    }
  };

  const toggleDifference = () => {
    if (diffX !== null && diffY !== null) {
      const index = diffY * boardSize + diffX;
      const animatedCell = document.getElementById(`right-cell-${index}`);
      if (animatedCell) {
        if (!isDifferenceShown) {
          setCorrectPick(index + 1);
          animatedCell.classList.add('pulse');
        } else {
          setCorrectPick(null);
          animatedCell.classList.remove('pulse');
        }
      }
      setIsDifferenceShown(!isDifferenceShown);
    }
  };

  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
    generateNewBoards(size);
    
    
    if (isDifferenceShown) {
      toggleDifference();
    }
  };

  const squareSize = Math.min((windowWidth * 0.45) / boardSize, (windowHeight * 0.8) / boardSize);

  if (leftBoard.length === 0 && rightBoard.length === 0) {
    generateNewBoards(boardSize);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8] text-black font-sans p-4">
      <div className="absolute top-4 right-4 z-10">
        <BoardSizeDropdown
          onSizeChange={handleBoardSizeChange}
          currentSize={boardSize}
        />
      </div>
      <div className="h-16"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-5 items-start justify-center">
          <div className="flex flex-col items-center">
            <BoardGrid board={leftBoard} squareSize={squareSize} boardSize={boardSize} />
            <div className="mt-2">
              <div className='calibration-dot'></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <BoardGrid board={rightBoard} squareSize={squareSize} boardSize={boardSize} isRightBoard onCellClick={handleSquareClick} />
            <div className="mt-2">
              <div className='calibration-dot'></div>
            </div>
          </div>
        </div>
      
        <div className="mt-4 text-black text-left w-full max-w-[calc(90%+20px)]">
          <p>Player Pick: {playerPick !== null ? playerPick : ''}</p>
          <p>Correct Pick: {correctPick !== null ? correctPick : ''}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center">
        <Button
          onClick={() => generateNewBoards(boardSize)}
          className="m-2 px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          Generate Board
        </Button>
        <Button
          onClick={toggleDifference}
          className="m-2 px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          {isDifferenceShown ? 'Hide Difference' : 'Show Difference'}
        </Button>
      </div>
    </div>
  );
};

export default Board;








