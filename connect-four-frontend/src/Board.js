import React, { useContext, useEffect } from 'react';

import { ConnectFourContext } from './ConnectFourContext';

const Board = () => {
    const { board, setBoard } = useContext(ConnectFourContext);
    //creates our board with empty values only if there is no board in state
    const createBoard = () => {
        const tempBoard = [];
        for(let i = 0; i < 4; i++){
            tempBoard.push([]);
            for(let j = 0; j < 4; j++){
                tempBoard[i].push("");
            }
        }
        return tempBoard;
    }

    const hoverPiece = (e) => {
        const piece = e.target;
        piece.classList.add('red-piece');
        piece.classList.remove('board-piece');
    }

    const revertPiece = (e) => {
        const piece = e.target;
        piece.classList.remove('red-piece');
        piece.classList.add('board-piece');
    }

    useEffect(() => {
        console.log(board)
        if(!board){
            setBoard(createBoard())
            localStorage.setItem('board', board);
        }
    }, [board, setBoard]);

    return (
        <div className='board'>
        {board?.map((ele, i) => {
            return board[i].map((ele, j) => {
                if(i === 0){
                    return <div onMouseEnter={hoverPiece} onMouseLeave={revertPiece} className='board-piece' x={i} y={j}></div> 
                }else{
                    return <div className='board-piece' x={i} y={j}></div>    
                }
            })
        })}
        </div>
    )
}

export default Board