// express server

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/error.js');
const authRouter = require('./routes/auth-router.js');
const taskRouter = require('./routes/task-router.js');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors());
server.use(morgan('dev'));

server.get('/', (req, res, next) => {
    res.send('API UP AND RUNNING');
});

server.use(authRouter);
server.use(taskRouter);

// error handling catch-alls
server.use(errorHandler);

module.exports = {
    server: server,
    start: port => {
        // start our server

        const PORT = port || process.env.PORT || 3000;

        server.listen(PORT, () => {
            console.log(`Server Up on ${PORT}`);
        });

        // connect to our DB

        const uri = process.env.MONGODB_URI;

        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };

        mongoose.connect(uri, options);
    },
};
