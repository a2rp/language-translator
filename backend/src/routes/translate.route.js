const express = require("express");
const router = express.Router();

const {
    translateText
} = require("../controllers/translate.controller");

router.post("/", translateText);

module.exports = router;


