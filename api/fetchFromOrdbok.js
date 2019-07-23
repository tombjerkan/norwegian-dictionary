const axios = require("axios");
const { JSDOM } = require("jsdom");
const _ = require("lodash");
const { removeChildrenByClassName, removeChildrenByTagName, takeTextContentUntilClass } = require("./dom");

async function fetchFromOrdbok(word) {
    const response = await axios.get(`https://ordbok.uib.no/perl/ordbok.cgi?OPP=${encodeURIComponent(word)}&ant_bokmaal=100`);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    removeChildrenByClassName(document, "kompakt");
    removeChildrenByTagName(document, "style");

    const tableRows = Array.from(document.querySelectorAll("#byttutBM > tbody > tr:not(#resultat_kolonne_overskrift_tr)"));
    const entries = tableRows.map(parseEntry);

    return entries;
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
    const isSingleSense = container.querySelectorAll(":scope > .tyding").length <= 1;

    if (isSingleSense) {
        return [parseSense(container)];
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

module.exports = fetchFromOrdbok;