const express = require("express");
const fetchFromOrdbok = require("./fetchFromOrdbok");
const fetchFromWiktionary = require("./fetchFromWiktionary");
const fetchFromGoogleTranslate = require("./fetchFromGoogleTranslate");

const app = express();

app.get("/api/ordbok/:word", async (req, res) => {
    const response = await fetchFromOrdbok(req.params.word);
    res.json(response);
});

app.get("/api/wiktionary/:word", async (req, res) => {
    const response = await fetchFromWiktionary(req.params.word);
    res.json(response);
});

app.get("/api/googleTranslate/:word", async (req, res) => {
    const response = await fetchFromGoogleTranslate(req.params.word);
    res.json(response);
});

app.listen(8080, () => console.log("Listening on port 8080..."));