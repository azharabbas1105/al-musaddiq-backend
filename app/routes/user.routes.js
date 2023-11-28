const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
 
  router.get("/",
  [
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  controller.getAllUsers
  );


module.exports = router;
