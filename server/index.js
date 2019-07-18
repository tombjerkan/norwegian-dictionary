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
    const articleContent = container.firstChild.nextSibling.querySelector(".artikkelinnhold");
    removeChildrenByClassName(articleContent, "oppsgramordklassevindu");

    return {
        term: container.firstChild.textContent,
        etymology: takeTextContentUntilClass(articleContent, "utvidet").trim(),
        senses: parseSenses(articleContent.querySelector(".utvidet"))
    };
}

function parseSenses(container) {
    const isSingleSense = container.querySelector(":scope > .doemeliste") !== null;

    if (isSingleSense) {
        return parseSense(container);
    } else {
        const senseContainers = container.querySelectorAll(":scope > .tyding");
        return Array.from(senseContainers).map(parseSense);
    }
}

function parseSense(container) {
    const definition = takeTextContentUntilClass(container, "doemeliste").trim().replace(/^\d+\s/, "") || null;

    const examplesContainer = container.querySelector(":scope > .doemeliste");
    const examples = examplesContainer && examplesContainer.textContent.trim();

    const subDefinitionContainer = container.querySelector(":scope > .tyding.utvidet");
    const subDefinition = subDefinitionContainer && {
        definition: takeTextContentUntilClass(subDefinitionContainer, "doemeliste").trim(),
        examples: subDefinitionContainer.querySelector(":scope > .doemeliste").textContent.trim()
    };

    const subEntryContainers = container.querySelectorAll(":scope > .artikkelinnhold > div");
    const subEntries = Array.from(subEntryContainers).map(subEntryContainer => ({
        term: subEntryContainer.querySelector(":scope > .artikkeloppslagsord").textContent.trim(),
        definition: subEntryContainer.querySelector(":scope > .utvidet").textContent.trim()
    }));

    return {
        definition,
        examples,
        subDefinition,
        subEntries
    };
}

app.listen(8080, () => console.log("Listening on port 8080..."));