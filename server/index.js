const axios = require("axios");
const express = require("express");
const { JSDOM } = require("jsdom");
const _ = require("lodash");

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
        definition: parseDefinition(container.firstChild.nextSibling)
    };
}

function parseDefinition(container) {
    const articleContent = container.querySelector(".artikkelinnhold");
    if (!articleContent) throw new Error("Invalid definition");

    const interpretationElements = articleContent.querySelectorAll(":scope > .utvidet > .tyding");

    if (interpretationElements.length === 0) {
        return {
            header: articleContent.textContent,
            interpretations: []
        };
    } else {
        const headerNodes = _.takeWhile(
            articleContent.childNodes,
            node => !(node.classList && node.classList.contains("utvidet"))
        ).filter(node => !(node.classList && node.classList.contains("oppsgramordklassevindu")));

        return {
            header: headerNodes.map(node => node.textContent).join(""),
            interpretations: Array.from(interpretationElements).map(parseInterpretation)
        };
    }
}

function parseInterpretation(container) {
    const header = _.takeWhile(
        container.childNodes,
        node => !(node.classList && node.classList.contains("doemeliste"))
    ).map(n => n.textContent).join("").trim().replace(/^\d+\s/, "");

    const examplesContainer = container.querySelector(".doemeliste");
    const examples = examplesContainer && examplesContainer.textContent.trim();

    const expandedContainer = container.querySelector(":scope > .tyding.utvidet");
    const expanded = expandedContainer && expandedContainer.textContent.trim();

    const articleEntryContainers = container.querySelectorAll(":scope > .artikkelinnhold > .utvidet");
    const articleContent = Array.from(articleEntryContainers).map(c => c.textContent.trim());

    return {
        header,
        examples,
        expanded,
        articleContent
    };
}

app.listen(8080, () => console.log("Listening on port 8080..."));