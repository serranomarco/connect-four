import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material'

import { ConnectFourContext } from './ConnectFourContext';
import NavBar from './NavBar';
import Player from './Player';
import Profile from './Profile'
import Board from './Board';
import Turn from './Turn';
import { apiUrl } from './config';

function App() {

    const createBoard = () => {
        const tempBoard = [];
        for(let i = 0; i < 4; i++){
            tempBoard.push([]);
            for(let j = 0; j < 4; j++){
                tempBoard[i].push("");
            }
        }
        localStorage.setItem('board', JSON.stringify(tempBoard));
        return tempBoard;
    }
    //creating our state
    const [gameId, setGameId] = useState(localStorage.getItem('game-id'));
    const [playerOneName, setPlayerOneName] = useState(localStorage.getItem('player-one-name'));
    const [playerTwoName, setPlayerTwoName] = useState(localStorage.getItem('player-two-name'));
    const [board, setBoard] = useState(localStorage.getItem('board')? JSON.parse(localStorage.getItem('board')) : createBoard());
    const [currentTurn, setCurrentTurn] = useState(localStorage.getItem('current-turn') ? parseInt(localStorage.getItem('current-turn')) : 1);
    const [isHidden, setIsHidden] = useState(true);
    const [winner, setWinner] = useState(false);

    const showForm = () => {
        const form = document.querySelector('.player-form');
        const board = document.querySelector('.board');
        const turn = document.querySelector('.player-turn');

        form.classList.remove('player-form--hidden');
        board.classList.add('board--hidden');
        turn.classList.add('player-turn--hidden');

        const profile = document.querySelectorAll('.player-profile');
        const quitButton = document.querySelectorAll('.quit-game');

        quitButton.forEach((ele) => {
            ele.classList.add('quit-game--hidden');
        })
        profile.forEach((ele) => {
            ele.classList.add('player-profile--hidden');
        });
    }

    const hideForm = () => {
        const form = document.querySelector('.player-form');
        const board = document.querySelector('.board');
        const turn = document.querySelector('.player-turn');

        form.classList.add('player-form--hidden');
        board.classList.remove('board--hidden');
        turn.classList.remove('player-turn--hidden');

        const profile = document.querySelectorAll('.player-profile');
        const quitButton = document.querySelectorAll('.quit-game');

        quitButton.forEach((ele) => {
            ele.classList.remove('quit-game--hidden');
        })
        profile.forEach((ele) => {
            ele.classList.remove('player-profile--hidden');
        });

    }


    const state = {
        gameId,
        setGameId,
        playerOneName,
        setPlayerOneName,
        playerTwoName,
        setPlayerTwoName,
        board,
        setBoard,
        currentTurn,
        setCurrentTurn,
        isHidden,
        setIsHidden,
        winner,
        setWinner,
        showForm,
        createBoard
    }

    

    //creates a post request to api server for creating new game
    const handleNewGame = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiUrl}/drop_disk`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              players: [playerOneName, playerTwoName],
              columns: 4,
              rows: 4
            })
        });
        if(response.ok){
            const json = await response.json();
            localStorage.setItem('game-id', json.gameId);
            localStorage.setItem('player-one-name', playerOneName);
            localStorage.setItem('player-two-name', playerTwoName);
            localStorage.setItem('player-one-id', json.player1);
            localStorage.setItem('player-two-id', json.player2);
            localStorage.setItem('current-turn', 1);
        }

    }

    

    useEffect(() => {
        if(localStorage.getItem('player-one-name') && localStorage.getItem('player-two-name')){
            setIsHidden(false);
            hideForm();
        }
    }, [setIsHidden])

    return (
        <ConnectFourContext.Provider value={state}>
            <NavBar />
            <div className='content-wrapper'>
                <div className='player-wrapper'>
                    <form onSubmit={(e) => {
                        handleNewGame(e);
                        hideForm();
                    }} className='player-form'>
                        <Player num={1} />
                        <Player num={2} />
                        <Button type='submit' className='new-game' variant='contained'>New Game</Button>
                    </form>
                    <div className='profile-wrapper'>
                        <Profile num={1} />
                        <div className='turn-wrapper'>
                            <Turn />
                            <Button onClick={(e) => {
                                setBoard(createBoard());
                                handleNewGame(e);
                                hideForm();
                                e.target.classList.add('next-game--hidden');
                                setWinner(false);
                            }} className='next-game next-game--hidden' variant='contained'>Next Game</Button>
                        </div>
                        <Profile num={2} />
                    </div>
                </div>
                <Board />
            </div>
        </ConnectFourContext.Provider>
    );
}

export default App;
