const express = require("express");
const fetchFromOrdbok = require("./fetchFromOrdbok");
const fetchFromWiktionary = require("./fetchFromWiktionary");
const fetchFromGoogleTranslate = require("./fetchFromGoogleTranslate");

const app = express();

app.get("/api/:word", async (req, res) => {
    const ordbokResponse = await fetchFromOrdbok(req.params.word);
    const wiktionaryResponse = await fetchFromWiktionary(req.params.word);
    const googleTranslateResponse = await fetchFromGoogleTranslate(req.params.word);

    res.json({
        ordbok: ordbokResponse,
        wiktionary: wiktionaryResponse,
        googleTranslate: googleTranslateResponse
    });
});

app.listen(8080, () => console.log("Listening on port 8080..."));