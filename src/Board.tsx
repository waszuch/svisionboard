import React, { useState, useEffect } from 'react';
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
      const newRightBoard = [...rightBoard];
      newRightBoard[index] = { ...newRightBoard[index], border: '4px solid black', zIndex: 1 };
      setRightBoard(newRightBoard);
    }
  };

  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
    generateBoards(size);
    setIsDropdownOpen(false);
  };

  // Warunek: jeżeli urządzenie jest w trybie pionowym i szerokość jest mniejsza niż np. 640px (telefon)
  const isPortraitOnMobile = windowWidth < 640 && windowHeight > windowWidth;

  // Jeżeli orientacja jest pionowa na telefonie, ustaw rozmiar planszy na 160x160
  const squareSize = isPortraitOnMobile
    ? 160 / boardSize // Każdy kwadrat będzie skalowany do planszy o rozmiarze 160x160 px
    : Math.min(
        Math.min(windowWidth, windowHeight) * 0.8 / boardSize, // Normalna skala na większych urządzeniach
        30 // Maksymalny rozmiar każdego kwadratu
      );

  // Inicjalne generowanie planszy
  if (leftBoard.length === 0 && rightBoard.length === 0) {
    generateBoards(boardSize);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#010758] to-[#490d61] text-white font-sans">
      <div className="flex flex-row gap-2">
        <div
          id="left-board"
          className="grid border-1 border-white bg-gray-800"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
            width: `${squareSize * boardSize}px`,
            height: `${squareSize * boardSize}px`,
          }}
        >
          {leftBoard.map((color, index) => (
            <div key={index} style={{ backgroundColor: color, width: squareSize, height: squareSize }} />
          ))}
        </div>
        <div
          id="right-board"
          className="grid border-1 border-white bg-gray-800"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
            gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`,
            width: `${squareSize * boardSize}px`,
            height: `${squareSize * boardSize}px`,
          }}
        >
          {rightBoard.map((cell, index) => (
            <div
              key={index}
              style={{ backgroundColor: cell.color, border: cell.border, width: squareSize, height: squareSize }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={() => generateBoards(boardSize)}
          className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          Generate Board
        </button>
        <button
          onClick={showDifference}
          className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
        >
          Show Differences
        </button>
      </div>
      <div className="fixed top-2 right-2">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="mx-2 px-5 py-2 text-lg sm:text-base sm:px-3 sm:py-1 cursor-pointer bg-[#620d91] text-white rounded transition-colors duration-300 hover:bg-[#7c27ab]"
          >
            Board Size
          </button>
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
