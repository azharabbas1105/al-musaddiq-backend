const db = require("../models");
const apiResponse = require("../utils/apiResponse");
const ROLES = db.ROLES;
const User = db.user;
const Customer = db.customer;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  try{
    
    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  }catch(error){
    return res.status(400).send({ message: error.message });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

checkPropertyAlotment = async(req, res, next) => {

  let query = {
    is_deleted: false,
    project: req.body.project,
    property_id: req.body.property_id
  }
  if(req.body.id){
    query['_id'] = {$ne : req.body.id}
  }
  let customer = await Customer.findOne(query);

    if (customer) {
      return apiResponse.errorMessage(req.body.property_id + " already alot to an other customer.", res);
      }
  next();
};

setHeader = async(req, res, next) => {
  res.header(
    "*",
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  );
  next();
};

const verification = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkPropertyAlotment,
  setHeader
};

module.exports = verification;
