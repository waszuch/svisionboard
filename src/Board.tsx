import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import "./style.css";
import { generateBoards, BoardCell } from './utils/boardUtils';
import BoardGrid from './components/ui/BoardGrid';

const Board: React.FC = () => {
  const [boardSize, setBoardSize] = useState<number>(64);
  const [diffX, setDiffX] = useState<number | null>(null);
  const [diffY, setDiffY] = useState<number | null>(null);
  const [leftBoard, setLeftBoard] = useState<string[]>([]);
  const [rightBoard, setRightBoard] = useState<BoardCell[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [message, setMessage] = useState<string>('');
  const [playerPick, setPlayerPick] = useState<number | null>(null);

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
    setPlayerPick(index);
    setMessage(`Your pick: Square ${index + 1}`);
  };

  const generateNewBoards = (size: number) => {
    const { newLeftBoard, newRightBoard, newDiffX, newDiffY } = generateBoards(size);
    setLeftBoard(newLeftBoard);
    setRightBoard(newRightBoard);
    setDiffX(newDiffX);
    setDiffY(newDiffY);
  };

  const showDifference = () => {
    if (diffX !== null && diffY !== null) {
      const index = diffY * boardSize + diffX;
      const animatedCell = document.getElementById(`right-cell-${index}`);
      if (animatedCell) {
        animatedCell.classList.add('pulse');
        let messageText = `The different square is number ${index + 1}`;
        if (playerPick === index) {
          messageText += ". You guessed correctly!";
        } else if (playerPick !== null) {
          messageText += ". Your guess was incorrect.";
        }
        setMessage(messageText);

        setTimeout(() => {
          animatedCell.classList.remove('pulse');
          setMessage('');
          setPlayerPick(null); 
        }, 6000);
      }
    }
  };

  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
    generateNewBoards(size);
    setIsDropdownOpen(false);
  };

  const squareSize = Math.min((windowWidth * 0.45) / boardSize, (windowHeight * 0.8) / boardSize);

  if (leftBoard.length === 0 && rightBoard.length === 0) {
    generateNewBoards(boardSize);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#010758] to-[#490d61] text-white font-sans p-4">
      <div className="flex flex-row gap-5 items-center justify-center">
        <BoardGrid board={leftBoard} squareSize={squareSize} boardSize={boardSize} />
        <BoardGrid board={rightBoard} squareSize={squareSize} boardSize={boardSize} isRightBoard onCellClick={handleSquareClick} />
      </div>
      <div className="mt-2 text-xl font-bold">{message}</div>
  
      <div className="mt-5 flex flex-wrap justify-center">
        <Button
          onClick={() => generateNewBoards(boardSize)}
          className="m-2 px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          Generate Board
        </Button>
        <Button
          onClick={showDifference}
          className="m-2 px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          Show Differences
        </Button>
      </div>
      <div className="fixed top-2 right-2 z-10">
        <div className="relative">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-3 py-1 text-sm cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
          >
            Board Size
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-pink-600 shadow-lg rounded">
              {[24, 32, 40, 48].map((size) => (
                <a
                  key={size}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleBoardSizeChange(size);
                  }}
                  className="block text-white no-underline px-4 py-2 hover:bg-pink-500 text-sm"
                >
                  {size}x{size}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;