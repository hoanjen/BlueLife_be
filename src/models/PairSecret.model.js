const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PairSecret = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    accessToken: {type: String, require: true},
    refreshToken: {type: String, require: true}
}, {
    timestamps: true
})

module.exports = mongoose.model('PairSecret', PairSecret)