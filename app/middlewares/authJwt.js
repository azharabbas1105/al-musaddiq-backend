const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  // let token = req.session.token;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.body["userId"] = decoded.id;
      next();
    });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.Roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.Roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

isAbleToChangeRole = async (req, res, next) => {

  if (req.session && req.session.User) {
    let isAdmin = req.session.User.Role.find((x) => x.name == "admin");
    if (!isAdmin) {
      res.status(403).send({ message: "Not able to change Role!" });
      return;
    }

    if (req.session.User._id.toString() == req.body.id) {
      res.status(403).send({ message: "Not able to change your own Role!" });
      return;
    }

    next();
    return;
  }

  res.status(403).send({ message: "Please authenticate" });
  return;
};


const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAbleToChangeRole
};
module.exports = authJwt;
