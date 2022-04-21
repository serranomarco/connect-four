import React, { useContext } from 'react';
import { apiUrl } from './config';

import { ConnectFourContext } from './ConnectFourContext';

const Board = () => {
    const { board, setBoard, currentTurn, setCurrentTurn } = useContext(ConnectFourContext);
    //creates our board with empty values only if there is no board in state

    const movePiece = async (e) => { 
        revertPiece(e)
        e.preventDefault();
        const column = e.target.getAttribute('y');
        const tempBoard = board;
        const gameId = localStorage.getItem('game-id');
        let playerId;

        console.log(currentTurn);

        if(currentTurn === 1){
            playerId = localStorage.getItem('player-one-id');
            console.log(playerId);
        }else if(currentTurn === 2){
            playerId = localStorage.getItem('player-two-id');
        }

        //placing our piece on the board where row is available and then changing the turn
        for(let i = tempBoard.length - 1; i >= 0; i--){
            if(tempBoard[i][column] === ""){
                tempBoard[i][column] = currentTurn;
                break;
            }
        }

        setBoard(tempBoard);
        localStorage.setItem('board', JSON.stringify(tempBoard));

        if(currentTurn === 1){
            setCurrentTurn(2);
            localStorage.setItem('current-turn', 2);
        }else if(currentTurn === 2){
            setCurrentTurn(1);
            localStorage.setItem('current-turn', 1);
        }

        const response = await fetch(`${apiUrl}/drop_disk/${gameId}/${playerId}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                column
            })
        });
    }

    const hoverPiece = (e) => {
        const piece = e.target;
        if(currentTurn === 1){
            piece.classList.add('red-piece');
        }else if(currentTurn === 2){
            piece.classList.add('yellow-piece');
        }
        piece.classList.remove('board-piece');
    }

    const revertPiece = (e) => {
        const piece = e.target;
        if(currentTurn === 1){
            piece.classList.remove('red-piece');
        }else if(currentTurn === 2){
            piece.classList.remove('yellow-piece');
        }
        piece.classList.add('board-piece');
    }

    if(board){
        return(
            <div className='board'>
            {board.map((ele, i) => {
                return board[i].map((ele, j) => {
                    if(i === 0){
                        //add in how to add a move
                        if(ele === 1){
                            return <div className='red-piece' x={i} y={j}></div> 
                        }else if(ele === 2){
                            return <div className='yellow-piece' x={i} y={j}></div>
                        }else{
                            return <div onClick={movePiece} onMouseEnter={hoverPiece} onMouseLeave={revertPiece} className='board-piece' x={i} y={j}></div> 
                        }
                    }else{
                        if(ele === 1){
                            return <div className='red-piece' x={i} y={j}></div> 
                        }else if(ele === 2){
                            return <div className='yellow-piece' x={i} y={j}></div> 
                        }else{
                            return <div className='board-piece' x={i} y={j}></div>    
                        }
                    }
                })
            })
            }
            </div>
            )
    }else{
        return (
            <div className='board'></div>
        )
    }
}

export default Board