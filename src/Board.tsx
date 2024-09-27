import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import "./style.css";
import { generateBoards, BoardCell } from './utils/boardUtils';
import BoardGrid from './components/board-grid';
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
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [differencesCount, setDifferencesCount] = useState<number>(1);

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

  useEffect(() => {
    generateNewBoards(boardSize);
  }, [boardSize, differencesCount]);

  const resetGame = () => {
    setPlayerPicks(new Set());
    setCorrectPicks(new Set());
    setIsDifferenceShown(false);
    setSelectedCells(new Set());

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('pulse-magenta', 'pulse'));
  };

  const handleSquareClick = (index: number) => {
    setSelectedCells(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else if (newSet.size < differencesCount) {
        newSet.add(index);
      }
      return newSet;
    });
    setPlayerPicks(prev => {
      const newPicks = new Set(prev);
      if (newPicks.has(index + 1)) {
        newPicks.delete(index + 1);
      } else if (newPicks.size < differencesCount) {
        newPicks.add(index + 1);
      }
      return newPicks;
    });
  };

  const generateNewBoards = (size: number) => {
    const { newLeftBoard, newRightBoard, differences } = generateBoards(size, differencesCount);
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
            if (playerPicks.has(index + 1)) {
              animatedCell.classList.add('pulse-correct', 'correct-pick');
            } else {
              animatedCell.classList.add('pulse');
            }
          } else {
            setCorrectPicks(new Set());
            animatedCell.classList.remove('pulse', 'pulse-correct', 'correct-pick');
          }
        }
      });
      setIsDifferenceShown(!isDifferenceShown);
    }
  };

  const handleBoardSizeChange = (value: number[]) => {
    const size = value[0];
    setBoardSize(size);
  };

  const handleDifferencesCountChange = (count: number) => {
    setDifferencesCount(count);
  };

  const calculateSquareSize = useCallback(() => {
    const isPortrait = windowWidth < windowHeight;
    if (isPortrait) {
      return Math.min(
        (windowWidth * 0.45) / boardSize,
        (windowHeight * 0.35) / boardSize
      );
    } else {
      return Math.min(
        (windowWidth * 0.45) / boardSize,
        (windowHeight * 0.7) / boardSize
      );
    }
  }, [windowWidth, windowHeight, boardSize]);
  const squareSize = calculateSquareSize();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-300 dark:bg-stone-900 text-black dark:text-white font-sans p-4">
        <div className="absolute top-4 left-4 z-10">
          <ModeToggle />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="board-container">
            <div className="flex flex-row gap-5 items-start justify-center">
              <div className="flex flex-col items-center">
                <BoardGrid board={leftBoard} squareSize={squareSize} boardSize={boardSize} selectedCells={new Set()} correctPicks={correctPicks} />
                <div className="mt-0">
                  <div className='calibration-dot'></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <BoardGrid 
                  board={rightBoard} 
                  squareSize={squareSize} 
                  boardSize={boardSize} 
                  isRightBoard 
                  onCellClick={handleSquareClick}
                  selectedCells={selectedCells}
                  correctPicks={correctPicks}
                />
                <div className="mt-0">
                  <div className='calibration-dot'></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-0 w-full max-w-[calc(90%+20px)]">
            <div className="text-center mb-2 text-black dark:text-white">
              {boardSize}x{boardSize}
            </div>
            <Slider
              min={5}
              max={60}
              step={1}
              value={[boardSize]}
              onValueChange={handleBoardSizeChange}
            />
          </div>
          <div className="mt-0 text-black dark:text-white text-left w-full max-w-[calc(90%+20px)]">
            <p>Player Picks: {[...playerPicks].sort((a, b) => a - b).map(pick => (
              <span key={pick} className="fixed-width-number-1">{pick}</span>
            ))}</p>
            <p>Correct Picks: {[...correctPicks].sort((a, b) => a - b).map(pick => (
              <span key={pick} className="fixed-width-number">{pick}</span>
            ))}</p>
          </div>
          <div className="mt-0 flex flex-wrap justify-center">
            {[1, 2, 3, 4].map(count => (
              <label key={count} className="m-2 px-3 py-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="differencesCount"
                  value={count}
                  checked={differencesCount === count}
                  onChange={() => handleDifferencesCountChange(count)}
                  className="mr-2"
                />
                {count}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-0 flex flex-wrap justify-center">
          <Button
            onClick={() => generateNewBoards(boardSize)}
            className="m-2 px-3 py-1 text-sm cursor-pointer bg-black dark:bg-white text-white dark:text-black rounded-lg transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Generate Board
          </Button>
          <Button
            onClick={toggleDifference}
            className="m-2 px-3 py-1 text-sm cursor-pointer bg-black dark:bg-white text-white dark:text-black rounded-lg transition-colors duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isDifferenceShown ? 'Hide Difference' : 'Show Difference'}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};
export default Board;