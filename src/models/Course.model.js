const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Course = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', require: true},
    nameCourse: { type: String, require: true },
    totalTerm: {type: Number, rquire: true},
    access: {type: String, require: true, default: 'public'}
}, {
    timestamps: true
})

module.exports = mongoose.model('Course', Course)