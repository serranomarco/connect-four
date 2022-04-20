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

        const game = await db.Games.create({
            playerOneId,
            playerTwoId
        });
        
        res.status(200);
        res.json({ gameId: game.id });
    }

}));

module.exports = router;