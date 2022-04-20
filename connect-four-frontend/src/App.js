import React, { useState } from 'react';
import { Button } from '@mui/material'

import { ConnectFourContext } from './ConnectFourContext';
import NavBar from './NavBar';
import Player from './Player';
import Board from './Board';
import { apiUrl } from './config';

function App() {
    //creating our state
    const [gameId, setGameId] = useState(localStorage.getItem('game-id'));
    const [playerOneName, setPlayerOneName] = useState(localStorage.getItem('player-one-name'));
    const [playerTwoName, setPlayerTwoName] = useState(localStorage.getItem('player-two-name'));
    const [board, setBoard] = useState(localStorage.getItem('board'));
    const [currentTurn, setCurrentTurn] = useState(localStorage.getItem('current-turn'));

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
        setCurrentTurn
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
        }
    }

    return (
        <ConnectFourContext.Provider value={state}>
            <NavBar />
            <div className='player-wrapper'>
                <form onSubmit={handleNewGame} className='player-form'>
                    <Player num={1} />
                    <Player num={2} />
                    <Button type='submit' className='new-game'>New Game</Button>
                </form>
                <Board />
            </div>
        </ConnectFourContext.Provider>
    );
}

export default App;
