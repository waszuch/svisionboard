import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import "./style.css";
import { generateBoards, BoardCell } from './utils/boardUtils';
import BoardGrid from './components/BoardGrid';
import BoardSizeDropdown from './components/BoardSizeDropdown';
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';

const Board: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(64);
  const [differences, setDifferences] = useState<Set<string>>(new Set());
  const [leftBoard, setLeftBoard] = useState<BoardCell[]>([]);
  const [rightBoard, setRightBoard] = useState<BoardCell[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [playerPicks, setPlayerPicks] = useState<Set<number>>(new Set());
  const [correctPicks, setCorrectPicks] = useState<Set<number>>(new Set());
  const [isDifferenceShown, setIsDifferenceShown] = useState(false);

  const resetGame = () => {
    setPlayerPicks(new Set());
    setCorrectPicks(new Set());
    setIsDifferenceShown(false);

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('pulse-magenta', 'pulse'));
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
    setPlayerPicks(prev => {
      const newPicks = new Set(prev);
      if (newPicks.has(index + 1)) {
        newPicks.delete(index + 1);
      } else if (newPicks.size < 4) {
        newPicks.add(index + 1);
      }
      return newPicks;
    });
  };

  const generateNewBoards = (size: number) => {
    const { newLeftBoard, newRightBoard, differences } = generateBoards(size);
    setLeftBoard(newLeftBoard);
    setRightBoard(newRightBoard);
    setDifferences(differences);
    resetGame();

    if (isDifferenceShown) {
      toggleDifference();
    }
  };

  const toggleDifference = () => {
    if (differences.size > 0) {
      differences.forEach(diff => {
        const [diffX, diffY] = diff.split(',').map(Number);
        const index = diffY * boardSize + diffX;
        const animatedCell = document.getElementById(`right-cell-${index}`);
        if (animatedCell) {
          if (!isDifferenceShown) {
            setCorrectPicks(prev => new Set(prev).add(index + 1));
            animatedCell.classList.add('pulse');
          } else {
            setCorrectPicks(new Set());
            animatedCell.classList.remove('pulse');
          }
        }
      });
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8] dark:bg-black text-black dark:text-white font-sans p-4">
        <div className="absolute top-4 left-4 z-10">
          <ModeToggle />
        </div>
        <div className="absolute top-4 right-4 z-10 light-bg-color">
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
              <div className="mt-0">
                <div className='calibration-dot'></div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <BoardGrid board={rightBoard} squareSize={squareSize} boardSize={boardSize} isRightBoard onCellClick={handleSquareClick} />
              <div className="mt-0">
                <div className='calibration-dot'></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-black dark:text-white text-left w-full max-w-[calc(90%+20px)]">
            <p>Player Picks: {[...playerPicks].join(', ')}</p>
            <p>Correct Picks: {[...correctPicks].join(', ')}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-center">
          <Button
            onClick={() => generateNewBoards(boardSize)}
            className="m-2 px-3 py-1 text-sm cursor-pointer bg-black dark:bg-white text-white dark:text-black rounded transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Generate Board
          </Button>
          <Button
            onClick={toggleDifference}
            className="m-2 px-3 py-1 text-sm cursor-pointer bg-black dark:bg-white text-white dark:text-black rounded transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isDifferenceShown ? 'Hide Difference' : 'Show Difference'}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Board;
