const { verification, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const validator = require("../middlewares/validator")
const { signUpValidation, signinValidation, updateRolesValidation, userPasswordResetValidation } = require("../validators/auth.validation")

const express = require("express");
const router = express.Router();

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     );
//     next();
//   });

router.post("/signup",
  (req, res, next) => {
    validator(req, res, next, signUpValidation)
  },
  [
    verification.checkDuplicateUsernameOrEmail,
    verification.checkRolesExisted
  ],
  controller.signup
);

router.post("/signin",
  (req, res, next) => {
    validator(req, res, next, signinValidation)
  },
  controller.signin
);

router.put("/update_role",
  (req, res, next) => {
    validator(req, res, next, updateRolesValidation)
  },
  [
    authJwt.verifyToken,
    authJwt.isAbleToChangeRole
  ],
  controller.updateRoles
);

router.put("/api/auth/update_password",
  (req, res, next) => {
    validator(req, res, next, userPasswordResetValidation)
  },
  [
    authJwt.verifyToken
  ],
  controller.updateUserPassword
);
router.post("/signout", 
controller.signout);
// };

module.exports = router;
