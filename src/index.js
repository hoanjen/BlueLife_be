const express = require('express')
const route = require('./routes/index.route')
require('dotenv').config()
require('express-async-errors')
const error = require('./middleware/error.middleware')
const db = require('./config/db')
const app = express()
const port = 3000

db.connect()

app.use(express.json())

app.get('/', (req, res) => {
    throw new Error('NNNNN')
});

route(app)

app.use(error);


app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})