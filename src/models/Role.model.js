const mongoose = require('mongoose');
const Schema = mongoose.Schema
const { paginate } = require('./plugins');
const Role = new Schema(
  {
    roleName: {
      type: String,
      trim: true,
      required: true,
    },
    roleIndex: {
      type: String,
      trim: true,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

Role.plugin(paginate);

Role.statics.isRoleTaken = async function (roleId, roleIndex) {
  const role = await this.findOne({
    roleIndex: roleIndex,
    _id: { $ne: roleId },
  });
  return !!role;
};


module.exports = mongoose.model('Role', Role);