
const express = require("express");
const router = express.Router();
const users = require("./user.routes");
const auth = require("./auth.routes");
const customer = require("./customer.routes");

router.use("/auth",auth);
router.use("/user",users);
router.use("/customer",customer)

module.exports = router;