import React, { useState, useEffect } from 'react';
import './style.css';

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

    const getRandomColor = (): string => {
        const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const generateBoards = () => {
        const newLeftBoard :string[]= [];
        const newRightBoard: BoardCell[] = [];

        const newDiffX = Math.floor(Math.random() * boardSize);
        const newDiffY = Math.floor(Math.random() * boardSize);

        setDiffX(newDiffX);
        setDiffY(newDiffY);

        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
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
    
    
    

    const handleBoardSizeChange = (size:number) => {
        setBoardSize(size);
        generateBoards();
    };

    useEffect(() => {
        generateBoards();
    }, [boardSize]);

    const squareSize = 640 / boardSize;

    return (
        <div className="container">
            <div className="board-wrapper">
                <div id="left-board" className="board" style={{
                    gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
                    gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`
                }}>
                    {leftBoard.map((color, index) => (
                        <div key={index} style={{ backgroundColor: color, width: squareSize, height: squareSize }} />
                    ))}
                </div>
                
                <div id="right-board" className="board" style={{
                     gridTemplateColumns: `repeat(${boardSize}, ${squareSize}px)`,
                     gridTemplateRows: `repeat(${boardSize}, ${squareSize}px)`
                }}>
                {rightBoard.map((cell, index) => (
                    <div key={index} style={{ backgroundColor: cell.color, border: cell.border, width: squareSize, height: squareSize }} />
                ))}
                </div>
            


            </div>
            <div className="controls">
                <button onClick={generateBoards}>Generate Board</button>
                <button onClick={showDifference}>Show Differences</button>
            </div>
            <div className="dropdown">
                <button>Board Size</button>
                <div className="content">
                    <a href='#' onClick={(e) => { e.preventDefault(); handleBoardSizeChange(24); }}>24x24</a>
                    <a href='#' onClick={(e) => { e.preventDefault(); handleBoardSizeChange(32); }}>32x32</a>
                    <a href='#' onClick={(e) => { e.preventDefault(); handleBoardSizeChange(40); }}>40x40</a>
                    <a href='#' onClick={(e) => { e.preventDefault(); handleBoardSizeChange(48); }}>48x48</a>
                </div>
            </div>
        </div>
    );
};

export default Board;