const { verification, authJwt } = require("../middlewares");
const controller = require("../controllers/customer.controller");
const validator = require("../middlewares/validator")
const { createCustomerValidation, cnicValidation, propertyIdValidation, updateCustomerValidation, getCustomerValidation, approvedCustomerValidation } = require("../validators/customer.validation")

const express = require("express");
const router = express.Router();

router.post("/",
  (req, res, next) => {
    validator(req, res, next, createCustomerValidation)
  },
  [
    authJwt.verifyToken,
    verification.checkPropertyAlotment
  ],
  controller.createCustomer
);

router.put("/",
  (req, res, next) => {
    validator(req, res, next, updateCustomerValidation)
  },
  [
    authJwt.verifyToken,
    verification.checkPropertyAlotment
  ],
  controller.updateCustomer
);
router.put("/approve",
  (req, res, next) => {
    validator(req, res, next, approvedCustomerValidation)
  },
  [
    authJwt.verifyToken
  ],
  controller.approveCustomer
);


router.get("/:id",
  [
    authJwt.verifyToken
  ],
  controller.getCustomerById
);

router.post("/get_customers",
  (req, res, next) => {
    validator(req, res, next, getCustomerValidation)
  },
  [
    authJwt.verifyToken
  ],
  controller.getAllCustomers
);

router.delete("/:id",
  [
    authJwt.verifyToken
  ],
  controller.deleteCustomer
);

router.get("/verify_cnic",
  (req, res, next) => {
    validator(req, res, next, cnicValidation)
  },
  controller.verifyCNIC
);

router.get("/verify_property_id",
  (req, res, next) => {
    validator(req, res, next, propertyIdValidation)
  },
  controller.verifiyPropertyId
);

module.exports = router;
