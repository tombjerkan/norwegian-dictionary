require('dotenv').config()
const express = require("express");
const fetchFromOrdbok = require("./fetchFromOrdbok");
const fetchFromWiktionary = require("./fetchFromWiktionary");
const fetchFromGoogleTranslate = require("./fetchFromGoogleTranslate");

const api = express.Router();

api.get("/ordbok/:word", async (req, res) => {
    const response = await fetchFromOrdbok(req.params.word);
    res.json(response);
});

api.get("/wiktionary/:word", async (req, res) => {
    const response = await fetchFromWiktionary(req.params.word);
    res.json(response);
});

api.get("/googleTranslate/:word", async (req, res) => {
    const response = await fetchFromGoogleTranslate(req.params.word);
    res.json(response);
});

module.exports = api;