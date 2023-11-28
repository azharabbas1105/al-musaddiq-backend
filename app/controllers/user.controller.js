const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  try{

    let users = await User.find(
      {
        is_deleted : false,
        _id : {'$ne': req.session.User._id}
      }
    ).populate("Roles", "-__v")

    if(users && users.length){
      return res.status(200).send(
        {
          success : true,
          results : users,
          message: "Get users successfully!"
        });
    }

    return res.status(404).send(
      {
        success : true,
        results : [],
        message: "Users Not found."
      });

    // User.find(
    //   {
    //     is_deleted : false,
    //     _id : {'$ne': req.session.User._id}
    //   }
    // ).populate("Roles", "-__v")
    // .exec((err, users) => {
    //   if (err) {
    //     res.status(500).send(
    //       {
    //         success : false,
    //         results : [],
    //         message: err
    //       }
    //       );
    //     return;
    //   }
    //   if (!users || users.length == 0) {
        
    //   }
    //   res.status(200).send(
    //     {
    //       success : true,
    //       results : users,
    //       message: "Get users successfully!"
    //     }
    //   );
    // });
  }catch(error){
    res.status(400).send(
      {
        success : false,
        results : [],
        message: error.message
      }
    );
  }
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
