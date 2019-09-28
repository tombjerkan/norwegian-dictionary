const express = require("express");
const ordbok = require("./ordbok");
const wiktionary = require("./wiktionary");
const googleTranslate = require("./googleTranslate");
const { handleErrors } = require("./errorHandling");

const router = express.Router();
router.use(ordbok);
router.use(wiktionary);
router.use(googleTranslate);

module.exports = { router, handleErrors };
