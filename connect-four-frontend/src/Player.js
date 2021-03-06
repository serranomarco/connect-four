import React, { useContext } from 'react';
import { TextField } from '@mui/material'

import { ConnectFourContext } from './ConnectFourContext';

const Player = ({num}) => {
    const { setPlayerOneName, setPlayerTwoName } = useContext(ConnectFourContext);

    const updatePlayer = (num, e) => {
        if(num === 1){
            setPlayerOneName(e.target.value);
        }else if (num === 2){
            setPlayerTwoName(e.target.value);
        }
    }


    return (
        <>
            <div className='player'>
                <TextField onChange={(e) => {
                    updatePlayer(num, e);
                }} style={{ marginBottom:'10px'}} id={`player-${num}`} label={`Player ${num}`} variant='standard' />
            </div>
        </>
    )
}

export default Player;