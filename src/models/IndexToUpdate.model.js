const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IndexToUpdate = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', require: true },
    updateIndex: { type: Date, require: true }
}, {
    timestamps: true
})



module.exports = mongoose.model('IndexToUpdate', IndexToUpdate)