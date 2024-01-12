const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { paginate } = require('./plugins')

const Term = new Schema({
    course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', require: true},
    nameTerm: {type: String, require: true},
    mean: {type: String, require: true}
}, {
    timestamps: true
})

Term.plugin(paginate);

module.exports = mongoose.model('Term', Term)