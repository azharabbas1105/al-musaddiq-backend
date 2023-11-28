const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: {
    type : String
  },
  is_deleted : {
    type : Boolean,
    default : false
  },
  deleted_at : {
    type : Date
  },
  updated_at : {
    type : Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})
const Role = mongoose.model("Role",roleSchema);

module.exports = Role;
