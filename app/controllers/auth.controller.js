const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {

  try {

    let roles = await Role.distinct("_id", {
      name: { $in: req.body.Role },
    });
    if (roles && roles.length) {
      const user = await User.create({
        email: req.body.email.toLowerCase(),
        password: bcrypt.hashSync(req.body.password, 8),
        Role: roles
      });
      if (user) {
        res.send({ message: "User was registered successfully!" });
      }
    } else {
      return res.status(404).send({ message: "Role Not found." });
    }

  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    let user = await User.findOne(
      {
        is_deleted: false,
        email: req.body.email.toLowerCase()
      })
      .populate("Role")

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

    req.session.token = token;
    req.session['User'] = user;

    res.status(200).send({
      id: user._id,
      email: user.email,
      roles: user.Role,
      token: token,
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.updateRoles = async (req, res) => {
  try {
    let user = await User.findById(req.body.id).populate("Role");
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    let roles = await Role.distinct("_id",
      {
        name: { $in: req.body.Role }
      });

    if (roles && roles.length) {
      user.Role = roles;
      await user.save();
      return res.send({ message: "Roles assign to user successfully!" });
    }

    return res.status(404).send({ message: "Role Not found." });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    if (req.session.User._id.toString() != req.body.id) {
      return res.status(404).send({ message: "User Not found." });
    }

    User.findOne(
      {
        is_deleted: false,
        _id: req.body.id
      })
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }
        user['password'] = bcrypt.hashSync(req.body.new_password, 8);
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Password changed successfully!" });
        });
      });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
