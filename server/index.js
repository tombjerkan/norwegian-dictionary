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

    removeChildrenByClassName(document, "kompakt");
    removeChildrenByTagName(document, "style");

    const tableRows = Array.from(document.querySelectorAll("#byttutBM > tbody > tr:not(#resultat_kolonne_overskrift_tr)"));
    const entries = tableRows.map(parseEntry);

    res.json(entries);
});

function removeChildrenByClassName(root, className) {
    const elements = root.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function removeChildrenByTagName(root, tagName) {
    const elements = root.getElementsByTagName(tagName);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function takeTextContentUntilClass(element, className) {
    const nodeList = _.takeWhile(
        element.childNodes,
        node => !(node.classList && node.classList.contains(className))
    );

    return nodeList.map(node => node.textContent).join("");
}

function parseEntry(container) {
    return {
        term: container.firstChild.textContent,
        definition: parseDefinition(container.firstChild.nextSibling)
    };
}

function parseDefinition(container) {
    const articleContent = container.querySelector(".artikkelinnhold");
    if (!articleContent) throw new Error("Invalid definition");

    removeChildrenByClassName(articleContent, "oppsgramordklassevindu");

    const isSingleInterpretation = articleContent.querySelector(":scope > .utvidet > .doemeliste") !== null;

    if (isSingleInterpretation) {
        return parseInterpretation(articleContent);
    } else {
        const interpretationElements = articleContent.querySelectorAll(":scope > .utvidet > .tyding");

        return {
            header: takeTextContentUntilClass(articleContent, "utvidet").trim(),
            interpretations: Array.from(interpretationElements).map(parseInterpretation)
        };
    }
}

function parseInterpretation(container) {
    const header = takeTextContentUntilClass(container, "utvidet").trim().replace(/^\d+\s/, "");

    const examplesContainer = container.querySelector(".doemeliste");
    const examples = examplesContainer && examplesContainer.textContent.trim();

    const expandedContainer = container.querySelector(".tyding.utvidet");
    const expanded = expandedContainer && parseExpanded(expandedContainer);

    const articleEntryContainers = container.querySelectorAll(":scope > .artikkelinnhold > .utvidet");
    const articleContent = Array.from(articleEntryContainers).map(parseArticleEntry);

    return {
        header,
        examples,
        expanded,
        articleContent
    };
}

function parseExpanded(container) {
    const header = takeTextContentUntilClass(container, "doemeliste").trim();

    const examplesContainer = container.querySelector(":scope > .doemeliste");
    const examples = examplesContainer && examplesContainer.textContent.trim();

    return {
        header,
        examples
    };
}

function parseArticleEntry(container) {
    const headerContainer = container.querySelector(":scope > .artikkeloppslagsord");
    if (headerContainer === null) throw Error("Invalid article entry.");
    const header = headerContainer.textContent.trim();

    const expandedContainer = container.querySelector(":scope > .utvidet");
    if (expandedContainer === null) throw Error("Invalid article entry.");
    const expanded = expandedContainer.textContent.trim();

    return {
        header,
        expanded
    };
}

app.listen(8080, () => console.log("Listening on port 8080..."));