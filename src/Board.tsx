import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const getRandomColor = (): string => {
    const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00'];
    return colors[Math.floor(Math.random() * colors.length)];
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
        setMessage(`The different square is number ${index + 1}`);
        
        setTimeout(() => {
          animatedCell.classList.remove('pulse');
          setMessage('');
        }, 2000);
      }
    }
  };
  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
    generateBoards(size);
    setIsDropdownOpen(false);
  };
  
  const isPortraitOnMobile = windowWidth < 640 && windowHeight > windowWidth;
 
  const squareSize = isPortraitOnMobile
    ? 160 / boardSize 
    : Math.min(
        Math.min(windowWidth, windowHeight) * 0.8 / boardSize, 
        30 
      );
 
  if (leftBoard.length === 0 && rightBoard.length === 0) {
    generateBoards(boardSize);
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#010758] to-[#490d61] text-white font-sans">
      <div className="flex flex-row gap-5">
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
            <div key={index} style={{ backgroundColor: color, width: squareSize, height: squareSize,border: '1px solid black',  }} />
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
            }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 text-xl font-bold">{message}</div>

      <div className="mt-5">
        <Button
          onClick={() => generateBoards(boardSize)}
          className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
         
        >
          Generate Board
        </Button>
        <Button
          onClick={showDifference}
          className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
          
        >
          Show Differences
        </Button>
      </div>
      <div className="fixed top-2 right-2">
        <div className="relative">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
          >
            Board Size
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-pink-600 shadow-lg">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBoardSizeChange(24);
                }}
                className="block text-white no-underline px-4 py-2 hover:bg-pink-500"
              >
                24x24
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBoardSizeChange(32);
                }}
                className="block text-white no-underline px-4 py-2 hover:bg-pink-500"
              >
                32x32
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBoardSizeChange(40);
                }}
                className="block text-white no-underline px-4 py-2 hover:bg-pink-500"
              >
                40x40
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBoardSizeChange(48);
                }}
                className="block text-white no-underline px-4 py-2 hover:bg-pink-500"
              >
                48x48
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Board;


