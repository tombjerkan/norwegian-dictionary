require('dotenv').config()
const express = require("express");
const ordbok = require("./ordbok");
const wiktionary = require("./wiktionary");
const googleTranslate = require("./googleTranslate");
const { ApiError } = require("./errorHandling");

const api = express.Router();
api.use(ordbok);
api.use(wiktionary);
api.use(googleTranslate);

api.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.code).send(err.message);
    } else {
        res.status(500).send();
    }
});

module.exports = api;