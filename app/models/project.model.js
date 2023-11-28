const mongoose = require("mongoose");

const projectScheema = new mongoose.Schema({

  name : {
    type: String
  },
  location : {
    type: String
  },
  is_deleted: {
    type: Boolean,
    default:false,
  },
  deleted_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
})

const Project = mongoose.model("Project", projectScheema);
module.exports = Project;
