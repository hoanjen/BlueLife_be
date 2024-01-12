const express = require('express');
const route = require('./routes/index.route');
const handlerError = require('./middleware/error.middleware');
require('dotenv').config();
require('express-async-errors');
const db = require('./config/db');
const app = express();
const port = 3000;
db.connect();

app.use(express.json());

app.get('/', (req, res) => {
    throw new Error('NNNNN')
});

route(app);

app.use(handlerError.errorToApiError);
app.use(handlerError.errorHandler);



app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
});