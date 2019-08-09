const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const {
    withAsyncErrorHandling,
    ApiError,
    isNotFoundError,
    isServiceUnavailableError,
    isNoResponseError
} = require("./errorHandling");
const _ = require("lodash");
const {
    takeChildNodesUntil,
    removeChildrenByClassName,
    isElementNode,
    isTextNode
} = require("./dom");

const router = Router();

router.get(
    "/wiktionary/:word",
    withAsyncErrorHandling(async (req, res) => {
        const document = await fetchDocument(req.params.word);

        removeChildrenByClassName(document, "mw-editsection");

        const content = document.getElementsByClassName("mw-parser-output")[0];
        const languages = separateByHeaders(Array.from(content.children), 2);
        const norwegianSection = languages["Norwegian Bokmål"];
        if (norwegianSection === undefined) {
            throw new ApiError(404);
        }

        const sections = separateByHeaders(norwegianSection, 3);
        delete sections["Pronunciation"];
        delete sections["References"];

        const entries = Object.values(sections).map(parseEntry);
        res.json(entries);
    })
);

async function fetchDocument(word) {
    try {
        const url = `https://en.wiktionary.org/wiki/${word}`;
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        return dom.window.document;
    } catch (err) {
        if (isNotFoundError(err)) {
            throw new ApiError(404);
        } else if (isServiceUnavailableError(err) || isNoResponseError(err)) {
            throw new ApiError(503);
        } else {
            throw err;
        }
    }
}

function separateByHeaders(elements, headerLevel) {
    const headerIndices = findAllIndices(
        elements,
        e => e.tagName === `H${headerLevel}`
    );
    const endIndices = headerIndices.slice(1);
    const startEndIndices = _.zip(headerIndices, endIndices);

    const sections = startEndIndices.map(([start, end]) =>
        elements.slice(start, end)
    );

    return Object.assign(
        {},
        ...sections.map(section => ({
            [section[0].textContent]: section.slice(1)
        }))
    );
}

function findAllIndices(array, predicate) {
    return array.reduce((accumulator, current, index) => {
        if (predicate(current)) {
            return [...accumulator, index];
        } else {
            return accumulator;
        }
    }, []);
}

function parseEntry(elements) {
    let etymology = null;
    if (elements[0].tagName === "P") {
        etymology = parseTextContentWithLinks(elements[0]).trim();
    }

    const type = parseTextContentWithLinks(
        elements.find(e => e.tagName === "H4")
    ).trim();
    const sections = separateByHeaders(elements, 4);
    const term = parseTextContentWithLinks(sections[type][0]).trim();
    const senses = Array.from(sections[type][1].children).map(parseSense);

    const subSections = separateByHeaders(sections[type], 5);
    const synonymsSubSection = subSections["Synonyms"];
    const synonyms =
        synonymsSubSection !== undefined
            ? Array.from(synonymsSubSection[0].children).map(li =>
                  parseTextContentWithLinks(li).trim()
              )
            : [];

    return {
        etymology,
        type,
        term,
        senses,
        synonyms
    };
}

function parseSense(sense) {
    const definitionNodes = takeChildNodesUntil(sense, "dl");
    const definition = parseTextContentWithLinks(...definitionNodes).trim();

    const examples = Array.from(sense.querySelectorAll("dl > dd")).map(
        example => parseTextContentWithLinks(example).trim()
    );

    return {
        definition,
        examples
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
                return `<Link to='${_.escape(to)}'>${textContent}</Link>`;
            } else if (isElementNode(node)) {
                return parseTextContentWithLinks(...node.childNodes);
            } else if (isTextNode(node)) {
                return _.escape(node.data);
            } else {
                return "";
            }
        })
        .join("");
}

function isLinkElement(element) {
    return (
        isElementNode(element) &&
        element.tagName === "A" &&
        getWordLinkedTo(element) !== null
    );
}

function getWordLinkedTo(anchor) {
    const linkToAnotherWord = /\/wiki\/(.+)#Norwegian_Bokmål/;
    const match = anchor.getAttribute("href").match(linkToAnotherWord);

    if (match) {
        return match[1];
    } else {
        return null;
    }
}

module.exports = router;
