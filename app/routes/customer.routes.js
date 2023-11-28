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
    verification.setHeader,
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
    verification.setHeader,
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
    verification.setHeader,
    authJwt.verifyToken
  ],
  controller.approveCustomer
);


router.get("/:id",
  [
    verification.setHeader,
    authJwt.verifyToken
  ],
  controller.getCustomerById
);

router.get("/",
  (req, res, next) => {
    validator(req, res, next, getCustomerValidation)
  },
  [
    verification.setHeader,
    authJwt.verifyToken
  ],
  controller.getAllCustomers
);

router.delete("/:id",
  [
    verification.setHeader,
    authJwt.verifyToken
  ],
  controller.deleteCustomer
);

router.get("/verify_cnic",
  (req, res, next) => {
    validator(req, res, next, cnicValidation)
  },
  [
    verification.setHeader
  ],
  controller.verifyCNIC
);

router.get("/verify_property_id",
  (req, res, next) => {
    validator(req, res, next, propertyIdValidation)
  },
  [
    verification.setHeader
  ],
  controller.verifiyPropertyId
);

module.exports = router;
