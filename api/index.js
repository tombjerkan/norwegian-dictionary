require("dotenv").config();
const express = require("express");
const ordbok = require("./ordbok");
const wiktionary = require("./wiktionary");
const googleTranslate = require("./googleTranslate");
const { handleErrors } = require("./errorHandling");

const api = express.Router();
api.use(ordbok);
api.use(wiktionary);
api.use(googleTranslate);

api.use(handleErrors);

module.exports = api;
