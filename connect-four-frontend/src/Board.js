import React, { useContext, useEffect } from 'react';
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

        if(currentTurn === 1){
            playerId = localStorage.getItem('player-one-id');
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

        await fetch(`${apiUrl}/drop_disk/${gameId}/${playerId}`, {
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

    const checkWinnerVertical = () => {
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length - 3; j++){
                const column = board[i];
                if (column[j] !== '' && column[j] === column[j + 1] && column[j] === column[j + 2] && column[j] === column[j + 3]) {
                    return true;
                }
            }
        }
    }

    const checkWinnerHorizontal = () => {
        for(let i = 0; i < board.length; i++){
            if (board[0][i] !== '' && board[0][i] === board[1][i] && board[0][i] === board[2][i] && board[0][i] === board[3][i]) {
                return true;
            }
        }
    }

    const checkWinnerDiagonal = () => {
        for (let i = 0; i < board.length - 3; i++) {
            for (let j = board[i].length - 1; j >= 0; j--) {
                if (board[i][j] !== '' &&
                    board[i][j] === board[i + 1][j - 1] &&
                    board[i][j] === board[i + 2][j - 2] &&
                    board[i][j] === board[i + 3][j - 3]) {
                    return true;
                }
            }
        }
        for (let i = board.length - 1; i >= 3; i--) {
            for (let j = board[i].length - 1; j >= 0; j--) {
                if (board[i][j] !== '' &&
                    board[i][j] === board[i - 1][j - 1] &&
                    board[i][j] === board[i - 2][j - 2] &&
                    board[i][j] === board[i - 3][j - 3]) {
                    return true;
                }
            }
        }
    }
    const checkWin = () => {
        if (checkWinnerVertical()) {
            console.log(true);
        }else if (checkWinnerHorizontal()) {
            console.log(true);
        }else if (checkWinnerDiagonal()) {
            console.log(true);
        }
    }

    useEffect(checkWin, [board, setBoard, checkWin]);

    if(board){
        return(
            <div className='board board--hidden'>
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