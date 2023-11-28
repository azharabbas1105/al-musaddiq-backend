const mongoose = require("mongoose");

const userScheema = new mongoose.Schema({

  email: {
    type: String
  },
  password: {
    type: String
  },
  is_deleted: {
    type: Boolean,
    default:false,
  },
  deleted_at: {
    type: Date
  },
  approved_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_supper_adming : {
    type: Boolean,
    default:false,
  },
  Project: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }
  ],
  Role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
})

const User = mongoose.model("User", userScheema);
module.exports = User;
