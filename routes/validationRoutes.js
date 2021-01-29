const express = require("express");
const router = express.Router();
const validationController = require("../controllers/validation");
const schemas = require("../helpers/schemas");
const validationHelper = require("../helpers/validationMiddleware");

router.route("/").get(validationController.information);
router.route("/validate-rule").post(validationHelper(schemas.ruleModel), validationController.validateRule)

module.exports = router;
