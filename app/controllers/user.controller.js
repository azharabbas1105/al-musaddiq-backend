const db = require("../models");
const apiResponse = require("../utils/apiResponse");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  try{

    let users = await User.find(
      {
        is_deleted : false,
        _id : {'$ne': req.session.User._id}
      }
    ).populate("Role")

    if(users && users.length){
      return apiResponse.retrieveData(users,res);
    }

    return apiResponse.errorMessage("Users Not found.",res)
  }catch(error){
    return apiResponse.throwError(error,res)
  }
};

