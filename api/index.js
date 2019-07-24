require('dotenv').config()
const express = require("express");
const fetchFromOrdbok = require("./fetchFromOrdbok");
const fetchFromWiktionary = require("./fetchFromWiktionary");
const fetchFromGoogleTranslate = require("./fetchFromGoogleTranslate");

const api = express.Router();

api.get("/ordbok/:word", async (req, res, next) => {
    try {
        const response = await fetchFromOrdbok(req.params.word);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

api.get("/wiktionary/:word", async (req, res, next) => {
    try {
        const response = await fetchFromWiktionary(req.params.word);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

api.get("/googleTranslate/:word", async (req, res, next) => {
    try {
        const response = await fetchFromGoogleTranslate(req.params.word);
        res.json(response);
    } catch (err) {
        next(err);
    }
});

module.exports = api;