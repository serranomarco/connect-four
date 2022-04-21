import React, { useContext } from 'react';
import { ConnectFourContext } from './ConnectFourContext';

const Turn = () => {
    const { currentTurn, winner } = useContext(ConnectFourContext);
    
    if(winner === 3){
        return(
            <h1 className='player-turn player-turn--hidden'>Game ended in a Tie!</h1>
        )
    }else if(currentTurn === 1 && !winner){
        return (
            <h1 className='player-turn player-turn--hidden'>Player 1's Turn</h1>
        )
    }else if(currentTurn === 2 && !winner){
        return (
            <h1 className='player-turn player-turn--hidden'>Player 2's Turn</h1>
        )
    }else if(winner){
        return (
            <h1 className='player-turn player-turn--hidden'>Congratulations Player {winner} wins!</h1>
        )
    }
}

export default Turn