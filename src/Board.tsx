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
        <BoardSizeDropdown
          onSizeChange={handleBoardSizeChange}
          currentSize={boardSize}
        />
      </div>
    </div>
  );
};

export default Board;
