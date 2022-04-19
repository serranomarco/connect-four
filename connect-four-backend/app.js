//entry file for backend
const express = require('express');

const db = require('./db/models');
const dropDisk = require('./routes/drop-disk');

const app = express();

app.use(express.json());
app.use('/drop_disk', dropDisk);

//handles errors and outputs message and stack as a json object
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status);
    res.json({
        status: err.status,
        title: err.title,
        message: err.message,
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the connect four backend!');
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
    });