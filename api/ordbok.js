const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const _ = require("lodash");
const { removeChildrenByClassName, removeChildrenByTagName, takeTextContentUntil } = require("./dom");

const router = Router();

router.get("/ordbok/:word", async (req, res, next) => {
    try {
        const response = await axios.get(`https://ordbok.uib.no/perl/ordbok.cgi?OPP=${encodeURIComponent(req.params.word)}&ant_bokmaal=100`);
        const html = response.data;
        const dom = new JSDOM(html);
        const document = dom.window.document;

        if (document.querySelector(".ikkefunnet") !== null) {
            next(404);
            return;
        }
    
        removeChildrenByClassName(document, "kompakt");
        removeChildrenByTagName(document, "style");
    
        const tableRows = Array.from(document.querySelectorAll("#byttutBM > tbody > tr:not(#resultat_kolonne_overskrift_tr)"));
        const entries = tableRows.map(parseEntry);
    
        res.json(entries);;
    } catch (err) {
        next(500);
    }
});

function parseEntry(container) {
    const articleContent = container.firstChild.nextSibling.querySelector(".artikkelinnhold");
    removeChildrenByClassName(articleContent, "oppsgramordklassevindu");

    return {
        term: container.firstChild.textContent,
        etymology: takeTextContentUntil(articleContent, ".utvidet").trim(),
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
    const definition = takeTextContentUntil(container, ".doemeliste, .tyding.utvidet, .artikkelinnhold").trim().replace(/^\d+\s/, "") || null;

    const examplesContainer = container.querySelector(":scope > .doemeliste");
    const examples = examplesContainer && examplesContainer.textContent.trim();

    const subDefinitionContainer = container.querySelector(":scope > .tyding.utvidet");
    const subDefinition = subDefinitionContainer && {
        definition: takeTextContentUntil(subDefinitionContainer, ".doemeliste").trim(),
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

module.exports = router;