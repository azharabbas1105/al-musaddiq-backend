const { authJwt,verification } = require("../middlewares");
const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
 
  router.get("/",
  [
    verification.setHeader,
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  controller.getAllUsers
  );


module.exports = router;
