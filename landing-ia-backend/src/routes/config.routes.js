const express = require("express");
const { getConfig } = require("../controllers/config.controller");
const router = express.Router();

router.get("/", getConfig);

module.exports = router;