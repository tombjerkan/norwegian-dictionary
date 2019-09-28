const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const _ = require("lodash");
const {
    removeChildrenByClassName,
    removeChildrenByTagName,
    takeChildNodesUntil
} = require("./dom");
const {
    withAsyncErrorHandling,
    ApiError,
    isServiceUnavailableError,
    isNoResponseError
} = require("./errorHandling");
const TextContentParser = require("./TextContentParser");

const router = Router();

const textContentParser = new TextContentParser(isLink, getWordLinkedTo);

router.get(
    "/ordbok/:word",
    withAsyncErrorHandling(async (req, res) => {
        const document = await fetchDocument(req.params.word);

        if (document.querySelector("#kolonnebm .ikkefunnet") !== null) {
            throw new ApiError(404);
        }

        // Remove hidden elements from DOM so that their text is not included
        // when getting textContent
        removeChildrenByClassName(document, "kompakt");
        removeChildrenByClassName(document, "oppsgramordklassevindu");
        removeChildrenByTagName(document, "style");

        const bokmaalTable = document.querySelector("#byttutBM");
        const entryRows = bokmaalTable.querySelectorAll(
            ":scope > tbody > tr:not(:first-child)"
        );
        const entries = Array.from(entryRows).map(parseEntry);

        res.json(entries);
    })
);

async function fetchDocument(word) {
    const encodedWord = encodeURIComponent(word);
    const url = `https://ordbok.uib.no/perl/ordbok.cgi?OPP=${encodedWord}`;

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        return dom.window.document;
    } catch (err) {
        if (isServiceUnavailableError(err) || isNoResponseError(err)) {
            throw new ApiError(503);
        } else {
            throw err;
        }
    }
}

function parseEntry(container) {
    const articleContent = container.firstChild.nextSibling.querySelector(
        ".artikkelinnhold"
    );
    const etymologyNodes = takeChildNodesUntil(articleContent, ".utvidet");
    const senseContainers = articleContent.querySelector(".utvidet");

    return {
        term: textContentParser
            .parse(container.firstChild)
            .replace(/\s\s+/g, " "),
        etymology: textContentParser.parse(...etymologyNodes),
        senses: parseSenses(senseContainers)
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
        subDefinitions: parseSubDefinitions(container),
        subEntries: parseSubEntries(container)
    };
}

function parseDefinition(senseContainer) {
    const definitionNodes = takeChildNodesUntil(
        senseContainer,
        ".doemeliste, .tyding.utvidet, .artikkelinnhold"
    );

    return textContentParser.parse(...definitionNodes).replace(/^\d+\s/, "");
}

function parseExamples(senseContainer) {
    const examplesContainer = senseContainer.querySelector(
        ":scope > .doemeliste"
    );

    if (examplesContainer === null) {
        return null;
    }

    return textContentParser.parse(examplesContainer);
}

function parseSubDefinitions(senseContainer) {
    const subDefinitionContainers = senseContainer.querySelectorAll(
        ":scope > .tyding.utvidet"
    );

    return Array.from(subDefinitionContainers).map(parseSubDefinition);
}

function parseSubDefinition(container) {
    const definitionNodes = takeChildNodesUntil(container, ".doemeliste");

    const examplesContainer = container.querySelector(":scope > .doemeliste");

    return {
        definition: textContentParser.parse(...definitionNodes),
        examples:
            examplesContainer && textContentParser.parse(examplesContainer)
    };
}

function parseSubEntries(senseContainer) {
    const subEntryContainers = senseContainer.querySelectorAll(
        ":scope > .artikkelinnhold > div"
    );

    return Array.from(subEntryContainers).map(parseSubEntry);
}

function parseSubEntry(container) {
    const termContainer = container.querySelector(
        ":scope > .artikkeloppslagsord"
    );
    const definitionContainer = container.querySelector(":scope > .utvidet");

    return {
        term: textContentParser.parse(termContainer),
        definition: textContentParser.parse(definitionContainer)
    };
}

function isLink(element) {
    return (
        element.classList.contains("henvisning") ||
        element.classList.contains("etymtilvising")
    );
}

function getWordLinkedTo(linkElement) {
    /* Example onclick attribute:
     *     bob_vise_ref_art(56729, '3313', '56732', '66235', 'stasjon')
     *
     * The 5th parameter contains the word being linked to.
     */
    const onClickParameterRegex = /^bob_vise_ref_art\(.*, .*, .*, .*, '(.*)'\)$/;

    const onClickParameter = linkElement
        .getAttribute("onclick")
        .match(onClickParameterRegex)[1];

    /* Need to remove roman numerals and/or numbers that precede or follow word
     * in onclick parameter, as they we do not use them. e.g:
     *
     *     III for -> for
     *     pynt (II) -> pynt
     *     svive (1) -> svive
     *     yrke (II,1) -> yrke
     */
    const to = onClickParameter
        .replace(/^[IVX]+\s+/, "")
        .replace(/\s+\([IVX]+\)$/, "")
        .replace(/\s+\(\d+\)$/, "")
        .replace(/\s+\([IVX]+,\d+\)$/, "");

    return to;
}

module.exports = router;
