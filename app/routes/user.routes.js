const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
// const validator = require("../middlewares/validator")
// const { signUpValidation, signinValidation, userPasswordResetValidation } = require("../validators/auth.validation")


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users/all",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllUsers);

  app.get("/api/test/user",
  [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
