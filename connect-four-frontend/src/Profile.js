import React, { useContext } from 'react';
import { Button } from '@mui/material';

import { ConnectFourContext } from './ConnectFourContext';
import { apiUrl } from './config';

const Profile = ({num}) => {
    const { setBoard, playerOneName, playerTwoName, setIsHidden, showForm, createBoard } = useContext(ConnectFourContext);

    const deleteGame = async (num) => {
        const gameId = localStorage.getItem('game-id')
        const playerId = num === 1 ? localStorage.getItem('player-one-id') : localStorage.getItem('player-two-id');
        await fetch(`${apiUrl}/drop_disk/${gameId}/${playerId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        createBoard();
        setBoard(JSON.parse(localStorage.getItem('board')));
    }

    if(num === 1){
        return (
                <div className='player-profile player-profile--hidden'>
                    <h2>{playerOneName ? playerOneName : ''}</h2>
                    <div className='red-piece'></div>
                    <Button onClick={() => {
                        setIsHidden(true)
                        deleteGame(num);
                        showForm();
                        localStorage.removeItem('player-one-name')
                        }} className='quit-game quit-game--hidden' variant="contained">Quit Game</Button>
                </div> 
        )
    }else{
        return(
                <div className='player-profile player-profile--hidden'>
                    <h2>{playerTwoName ? playerTwoName : ''}</h2>
                    <div className='yellow-piece'></div>
                    <Button onClick={() => {
                        setIsHidden(true)
                        deleteGame(num);
                        showForm();
                        localStorage.removeItem('player-two-name')
                        }} className='quit-game quit-game--hidden' variant="contained">Quit Game</Button>
                </div> 
        )
    }
    
}

export default Profile;