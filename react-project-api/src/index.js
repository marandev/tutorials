const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const user = require('./api/user');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(express.json());

app.use('/api/user', user);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});