const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const {
    isElementNode,
    isTextNode,
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

const router = Router();

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
            ":scope > tbody > tr:not(#resultat_kolonne_overskrift_tr)"
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
        term: parseTextContentWithLinks(container.firstChild).trim(),
        etymology: parseTextContentWithLinks(...etymologyNodes).trim(),
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
        subDefinition: parseSubDefinition(container),
        subEntries: parseSubEntries(container)
    };
}

function parseDefinition(senseContainer) {
    const definitionNodes = takeChildNodesUntil(
        senseContainer,
        ".doemeliste, .tyding.utvidet, .artikkelinnhold"
    );

    return parseTextContentWithLinks(...definitionNodes)
        .trim()
        .replace(/^\d+\s/, "");
}

function parseExamples(senseContainer) {
    const examplesContainer = senseContainer.querySelector(
        ":scope > .doemeliste"
    );

    if (examplesContainer === null) {
        return null;
    }

    return parseTextContentWithLinks(examplesContainer).trim();
}

function parseSubDefinition(senseContainer) {
    const subDefinitionContainer = senseContainer.querySelector(
        ":scope > .tyding.utvidet"
    );

    if (subDefinitionContainer === null) {
        return null;
    }

    const definitionNodes = takeChildNodesUntil(
        subDefinitionContainer,
        ".doemeliste"
    );

    const examplesContainer = subDefinitionContainer.querySelector(
        ":scope > .doemeliste"
    );

    return {
        definition: parseTextContentWithLinks(...definitionNodes).trim(),
        examples: parseTextContentWithLinks(examplesContainer).trim()
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
        term: parseTextContentWithLinks(termContainer).trim(),
        definition: parseTextContentWithLinks(definitionContainer).trim()
    };
}

function parseTextContentWithLinks(...nodes) {
    return nodes
        .map(node => {
            if (isLinkElement(node)) {
                const textContent = parseTextContentWithLinks(
                    ...node.childNodes
                );
                const to = getWordLinkedTo(node);
                return `<Link to='${to}'>${textContent}</Link>`;
            } else if (isElementNode(node)) {
                return parseTextContentWithLinks(...node.childNodes);
            } else if (isTextNode(node)) {
                return node.data;
            } else {
                return "";
            }
        })
        .join("");
}

function isLinkElement(element) {
    if (!isElementNode(element)) {
        return false;
    }

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

    /* Need to remove roman numerals that precede or follow word in onclick
     * parameter, as they we do not use them. e.g:
     *
     *     III for -> for
     *     pynt (II) -> pynt
     */
    const to = onClickParameter
        .replace(/^[IVX]+\s+/, "")
        .replace(/\s+\([IVX]+\)$/, "");

    return to;
}

module.exports = router;
