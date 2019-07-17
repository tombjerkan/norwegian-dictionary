const axios = require("axios");
const express = require("express");
const { JSDOM } = require("jsdom");

const app = express();

app.get("/api/:word", async (req, res) => {
    const response = await axios.get(`https://ordbok.uib.no/perl/ordbok.cgi?OPP=${req.params.word}&ant_bokmaal=100`);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const hiddenElements = document.getElementsByClassName("kompakt");
    const styleElements = document.getElementsByTagName("style");
    const elementsToRemove = [...hiddenElements, ...styleElements];
    elementsToRemove.forEach(e => e.parentNode.removeChild(e));

    const tableRows = Array.from(document.querySelectorAll("#byttutBM > tbody > tr:not(#resultat_kolonne_overskrift_tr)"));
    const entries = tableRows.map(parseEntry);

    res.json(entries);
});

function parseEntry(container) {
    return {
        term: container.firstChild.textContent,
        definition: container.firstChild.nextSibling.textContent.trim()
    };
}

app.listen(8080, () => console.log("Listening on port 8080..."));