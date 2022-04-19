//entry file
const express = require('express');

const db = require('./db/models');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the connect four app!');
});

//Checking for database connection
db.sequelize.authenticate()
    .then (() => {
        console.log('Database connection successful!');
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}...`)
        });
    })
    .catch((err) => {
        console.log('Database connection failed.');
        console.error(err, 500)
    })