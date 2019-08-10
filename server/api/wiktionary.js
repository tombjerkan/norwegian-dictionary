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
const { takeChildNodesUntil, removeChildrenByClassName } = require("./dom");
const TextContentParser = require("./TextContentParser");

const router = Router();

const textContentParser = new TextContentParser(isLink, getWordLinkedTo);

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

        const entries = separateEntries(norwegianSection);
        return res.json(entries.map(e => parseEntry(e)));
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

function separateEntries(languageEntry) {
    if (hasMultipleEntries(languageEntry)) {
        const headerIndices = findAllIndices(languageEntry, isEntryHeader);

        const startIndices = headerIndices.map(i => i + 1);
        const endIndices = headerIndices.slice(1);

        return _.zip(startIndices, endIndices).map(([start, end]) =>
            languageEntry.slice(start, end)
        );
    } else {
        return [languageEntry];
    }
}

function isHeader(element) {
    return ["H1", "H2", "H3", "H4", "H5", "H6"].includes(element.tagName);
}

function hasMultipleEntries(languageEntry) {
    return languageEntry.some(isEntryHeader);
}

function isEntryHeader(element) {
    return isHeader(element) && /^Etymology \d+$/.test(element.textContent);
}

function parseEntry(elements) {
    const headerIndices = findAllIndices(elements, isHeader);
    const endIndices = headerIndices.slice(1);

    const sections = _.zip(headerIndices, endIndices).map(
        ([headerIndex, endIndex]) => [
            elements[headerIndex].textContent,
            elements.slice(headerIndex + 1, endIndex)
        ]
    );

    let etymologySection = sections.find(s => s[0] === "Etymology");
    if (etymologySection === undefined) {
        etymologySection = elements.slice(0, headerIndices[0]);
    } else {
        etymologySection = etymologySection[1];
    }
    const etymology =
        etymologySection.length !== 0
            ? textContentParser.parse(...etymologySection)
            : null;

    const types = [
        "Adjective",
        "Adverb",
        "Ambiposition",
        "Article",
        "Circumposition",
        "Classifier",
        "Conjunction",
        "Contraction",
        "Counter",
        "Determiner",
        "Ideophone",
        "Interjection",
        "Noun",
        "Numeral",
        "Participle",
        "Particle",
        "Postposition",
        "Preposition",
        "Pronoun",
        "Proper noun",
        "Verb"
    ];

    const subEntries = sections
        .filter(s => types.includes(s[0]))
        .map(subEntry => ({
            type: subEntry[0],
            term: textContentParser.parse(subEntry[1][0]),
            senses: Array.from(subEntry[1][1].children).map(parseSense)
        }));

    const synonymsSubSection = sections.find(s => s[0] === "Synonyms");
    const synonyms =
        synonymsSubSection !== undefined
            ? Array.from(synonymsSubSection[1][0].children).map(li =>
                  textContentParser.parse(li)
              )
            : [];

    // Header indentation level of 'Derived terms' differs from entry to entry
    require("../logger").debug(sections.map(s => s[0]));
    const derivedTermsSubSection = sections.find(s => s[0] === "Derived terms");
    const derived = parseDerivedTerms(
        derivedTermsSubSection && derivedTermsSubSection[1]
    );

    return {
        etymology,
        subEntries,
        synonyms,
        derived
    };
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

function parseSense(sense) {
    const definitionNodes = takeChildNodesUntil(sense, "dl");
    const definition = textContentParser.parse(...definitionNodes);

    const examples = Array.from(sense.querySelectorAll("dl > dd")).map(
        example => textContentParser.parse(example)
    );

    return {
        definition,
        examples
    };
}

function parseDerivedTerms(elements) {
    if (elements === undefined) {
        return [];
    }

    const listItems = elements
        .map(e => Array.from(e.querySelectorAll("li")))
        .flat();

    return listItems.map(item => textContentParser.parse(item));
}

function isLink(element) {
    return element.tagName === "A" && getWordLinkedTo(element) !== null;
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
