const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'},
    isAdmin: { type: Boolean, require: true },
    friend: { type: Array }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', User)