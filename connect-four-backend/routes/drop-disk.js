//routes for /drop_disk
const express = require('express');
const db = require('../db/models');
const { asyncHandler } = require('../utils');

const router = express.Router();

//Returns all the in-progress games
router.get('/', asyncHandler(async (req, res, next) => {
    const games = await db.Games.findAll({}, { attributes: ['id'] });
    res.status(200)
    res.json({ games });
}));

//Creates a new game
router.post('/', asyncHandler(async (req, res, next) => {
    const { players } = req.body;
    if(!players){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Request must be in the correct format.';
        next(err);
    }else{
        const [player1, player2] = players;
        
        //creates players in database if it doesn't exist then creates a game
        //with those players
        let playerOne = await db.Players.findOne({
            where: { name: player1 }
        });
        let playerTwo = await db.Players.findOne({
            where: { name: player2 }
        });

        if(!playerOne){
            playerOne = await db.Players.create({
                name: player1
            });
        }

        if(!playerTwo){
            playerTwo = await db.Players.create({
                name: player2
            });
        }

        const playerOneId = playerOne.id;
        const playerTwoId = playerTwo.id;
        const state = 'IN_PROGRESS';

        const game = await db.Games.create({
            playerOneId,
            playerTwoId,
            state
        });
        
        res.status(200);
        res.json({ gameId: game.id });
    }

}));

//Gets the state of the game
router.get('/:gameId', asyncHandler(async (req, res, next) => {
    const gameId = req.params.gameId;
    if(!Number.isInteger(parseInt(gameId))){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Could not process request game ID must be an integer';
        next(err);
    }

    const game = await db.Games.findByPk(gameId);
    if(game){
        const player1 = await db.Players.findByPk(game.playerOneId, { attributes: ['name'] });
        const player2 = await db.Players.findByPk(game.playerTwoId, { attributes: ['name'] });

        res.status(200);
        if(game.state == 'DONE'){
            res.json({
                players: [player1.name, player2.name],
                state: game.state,
                winner: game.winner
            });
        }else{
            res.json({
                players: [player1.name, player2.name],
                state: game.state
            });
        }
    }else
    {
        const err = new Error('Games/Moves no found');
        err.title = 'Games/Moves no found';
        err.status = 404;
        err.message = 'Request could not process as no game exists.';
        next(err);
    }
}));

//Grabs a all the moves for a particular game
router.get('/:gameId/moves', asyncHandler(async (req, res, next) => {
    const gameId = req.params.gameId;
    if(!Number.isInteger(parseInt(gameId))){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Could not process request game ID must be an integer';
        next(err);
    }

    const game = await db.Games.findByPk(gameId);

    if(game){
        const moves = await db.Moves.findAll({
            where: {
                gameId: gameId
            },
            attributes: ['playerId', 'column']
        });
        res.status(200);
        res.json({
            moves: moves.map(async (move) => {
                const player = await db.Players.findByPk(move.playerId);
                return {
                    type: 'MOVE',
                    player: player.name,
                    column: move.column
                }
            }),
        });
    }else
    {
        const err = new Error('Games/Moves no found');
        err.title = 'Games/Moves no found';
        err.status = 404;
        err.message = 'Request could not process as no game exists.';
        next(err);
    }
}));

//posts a move to a certain game and checks if the player can make that move
router.post('/:gameId/:playerId', asyncHandler(async (req, res, next) => {
    const gameId = req.params.gameId;
    const playerId = req.params.playerId;
    if(!Number.isInteger(parseInt(gameId)) || !Number.isInteger(parseInt(playerId))){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Could not process request game ID and player ID must be an integer';
        next(err);
    }

    const { column } = req.body;
    if(!column){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Request must be in the correct format.';
        next(err);
    }

    const game = await db.Games.findByPk(gameId);
    if(game){

        const moves = await db.Moves.findAll({
            where: {
                gameId: gameId
            },
            attributes: ['playerId']
        });
        //checks who made the last move
        if(moves[moves.length - 1].playerId === parseInt(playerId)){
            const err = new Error('Not your turn!');
            err.title = 'Not your turn';
            err.status = 409;
            err.message = 'Request could not be made. Player cannot make two moves in a row';
            next(err);
        }else{
            const move = await db.Moves.create({
                column,
                playerId,
                gameId
            });
    
            res.status(200);
            res.json({
                move: `${gameId}/moves/${moves.length + 1}`
            });
        }

    }else
    {
        const err = new Error('Games/Moves no found');
        err.title = 'Games/Moves no found';
        err.status = 404;
        err.message = 'Request could not process as no game exists.';
        next(err);
    }
}));

//Get a move and get data of who made it and which column
router.get('/:gameId/moves/:moveNumber', asyncHandler(async (req, res, next) => {
    const gameId = req.params.gameId;
    const moveNumber = req.params.moveNumber;
    if(!Number.isInteger(parseInt(gameId)) || !Number.isInteger(parseInt(moveNumber))){
        const err = new Error('Malformed request');
        err.title = 'Malformed request';
        err.status = 400;
        err.message = 'Could not process request game ID and move number must be an integer';
        next(err);
    }

    const game = await db.Games.findByPk(gameId)
    if(game){
        const moves = await db.Moves.findAll({
            where: { gameId: gameId }
        });

        const move = moves[moveNumber - 1];
        const player = await db.Players.findByPk(move.playerId);
        if(move){
            res.status(200);
            res.json({
                type: "MOVE",
                player: player.name,
                column: move.column
            });
        }else{
            const err = new Error('Games/Moves no found');
            err.title = 'Games/Moves no found';
            err.status = 404;
            err.message = 'Request could not process as no move exists.';
            next(err);
        }
    }else{
        const err = new Error('Games/Moves no found');
        err.title = 'Games/Moves no found';
        err.status = 404;
        err.message = 'Request could not process as no game exists.';
        next(err);
    }

}));



module.exports = router;