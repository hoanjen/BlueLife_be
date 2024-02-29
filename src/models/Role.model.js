const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { paginate } = require('./plugins');

const Role = new Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
   roleName: { type: String, require: true },
}, {
   timestamps: true
});

Role.plugin(paginate);

module.exports = mongoose.model('Role', Role);