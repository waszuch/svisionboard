import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import "./style.css";

interface BoardCell {
  color: string;
  border: string;
  zIndex?: number;
}

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

  const getRandomColor = (): string => {
    const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSquareClick = (index: number) => {
    setPlayerPick(index);
    setMessage(`Your pick: Square ${index + 1}`);
  };

  const generateBoards = (size: number) => {
    const newLeftBoard: string[] = [];
    const newRightBoard: BoardCell[] = [];
    const newDiffX = Math.floor(Math.random() * size);
    const newDiffY = Math.floor(Math.random() * size);
    setDiffX(newDiffX);
    setDiffY(newDiffY);
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
    setLeftBoard(newLeftBoard);
    setRightBoard(newRightBoard);
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
    generateBoards(size);
    setIsDropdownOpen(false);
  };

  const squareSize = Math.min((windowWidth * 0.45) / boardSize, (windowHeight * 0.8) / boardSize);

  if (leftBoard.length === 0 && rightBoard.length === 0) {
    generateBoards(boardSize);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#010758] to-[#490d61] text-white font-sans p-4">
      <div className="flex flex-row gap-5 items-center justify-center">
        <div
          id="left-board"
          className="grid border-3 border-black bg-gray-800"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
            width: `${squareSize * boardSize}px`,
            height: `${squareSize * boardSize}px`,
          }}
        >
          {leftBoard.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color, width: squareSize, height: squareSize, border: '1px solid black' }}
            />
          ))}
        </div>
        <div
          id="right-board"
          className="grid border-3 border-black bg-gray-800"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
            width: `${squareSize * boardSize}px`,
            height: `${squareSize * boardSize}px`,
          }}
        >
          {rightBoard.map((cell, index) => (
            <div
              id={`right-cell-${index}`}
              key={index}
              className="cell"
              style={{
                backgroundColor: cell.color,
                width: squareSize,
                height: squareSize,
                border: '1px solid black',
                cursor: 'pointer',
              }}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 text-xl font-bold">{message}</div>
  
      <div className="mt-5 flex flex-wrap justify-center">
        <Button
          onClick={() => generateBoards(boardSize)}
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