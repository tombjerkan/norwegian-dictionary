const axios = require("axios");
const express = require("express");

const app = express();

app.get("/api/:word", async (req, res) => {
    const response = await axios.get(`https://ordbok.uib.no/perl/ordbok.cgi?OPP=${req.params.word}&ant_bokmaal=100`);
    const html = response.data;
    res.json({ word: html });
});

app.listen(8080, () => console.log("Listening on port 8080..."));