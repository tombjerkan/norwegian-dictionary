const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const {
    removeChildrenByClassName,
    removeChildrenByTagName,
    takeTextContentUntil
} = require("./dom");
const { handleAsyncErrors, ApiError } = require("./errorHandling");

const router = Router();

router.get(
    "/ordbok/:word",
    handleAsyncErrors(async (req, res) => {
        const document = await fetchDocument(req.params.word);

        if (document.querySelector(".ikkefunnet") !== null) {
            throw new ApiError(404);
        }

        // Remove hidden elements from DOM so that their text is not included
        // when getting textContent
        removeChildrenByClassName(document, "kompakt");
        removeChildrenByClassName(document, "oppsgramordklassevindu");
        removeChildrenByTagName(document, "style");

        const bokmaalTable = document.querySelector("#byttutBM");
        const entryRows = bokmaalTable.querySelectorAll(
            ":scope > tbody > tr:not(#resultat_kolonne_overskrift_tr)"
        );
        const entries = Array.from(entryRows).map(parseEntry);

        res.json(entries);
    })
);

async function fetchDocument(word) {
    const encodedWord = encodeURIComponent(word);
    const url = `https://ordbok.uib.no/perl/ordbok.cgi?OPP=${encodedWord}`
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    return dom.window.document;
}

function parseEntry(container) {
    const articleContent = container.firstChild.nextSibling.querySelector(
        ".artikkelinnhold"
    );

    return {
        term: container.firstChild.textContent,
        etymology: takeTextContentUntil(articleContent, ".utvidet").trim(),
        senses: parseSenses(articleContent.querySelector(".utvidet"))
    };
}

function parseSenses(container) {
    const isSingleSense =
        container.querySelectorAll(":scope > .tyding").length <= 1;

    if (isSingleSense) {
        return [parseSense(container)];
    } else {
        const senseContainers = container.querySelectorAll(":scope > .tyding");
        return Array.from(senseContainers).map(parseSense);
    }
}

function parseSense(container) {
    return {
        definition: parseDefinition(container),
        examples: parseExamples(container),
        subDefinition: parseSubDefinition(container),
        subEntries: parseSubEntries(container)
    };
}

function parseDefinition(senseContainer) {
    const originalTextContent = takeTextContentUntil(
        senseContainer,
        ".doemeliste, .tyding.utvidet, .artikkelinnhold"
    );

    return originalTextContent.trim().replace(/^\d+\s/, "");
}

function parseExamples(senseContainer) {
    const examplesContainer = senseContainer.querySelector(
        ":scope > .doemeliste"
    );

    if (examplesContainer === null) {
        return null;
    }

    return examplesContainer.textContent.trim();
}

function parseSubDefinition(senseContainer) {
    const subDefinitionContainer = senseContainer.querySelector(
        ":scope > .tyding.utvidet"
    );

    if (subDefinitionContainer === null) {
        return null;
    }

    const definition = takeTextContentUntil(
        subDefinitionContainer, ".doemeliste"
    ).trim();

    const examples = subDefinitionContainer
        .querySelector(":scope > .doemeliste")
        .textContent
        .trim();

    return { definition, examples };
}

function parseSubEntries(senseContainer) {
    const subEntryContainers = senseContainer.querySelectorAll(
        ":scope > .artikkelinnhold > div"
    );

    return Array.from(subEntryContainers).map(parseSubEntry);
}

function parseSubEntry(container) {
    const term = container
        .querySelector(":scope > .artikkeloppslagsord")
        .textContent
        .trim();

    const definition = container
        .querySelector(":scope > .utvidet")
        .textContent
        .trim();

    return { term, definition };
}

module.exports = router;
