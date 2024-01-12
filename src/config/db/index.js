const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/BlueLife'),
        {
            useCreateIndex: true
        }
        console.log("Config mongodb success")
    } catch (error) {
        console.log(error)
    }
}

module.exports = { connect }