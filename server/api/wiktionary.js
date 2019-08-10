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

const partOfSpeechTypes = [
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

router.get(
    "/wiktionary/:word",
    withAsyncErrorHandling(async (req, res) => {
        const document = await fetchDocument(req.params.word);
        removeEditButtons(document);
        const norwegianSection = getNorwegianSection(document);
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

function removeEditButtons(document) {
    removeChildrenByClassName(document, "mw-editsection");
}

function getNorwegianSection(document) {
    const container = document.getElementsByClassName("mw-parser-output")[0];
    const elements = Array.from(container.children);

    const norwegianHeaderIndex = elements.findIndex(
        e => isLanguageHeader(e) && e.textContent === "Norwegian Bokmål"
    );

    if (norwegianHeaderIndex === -1) {
        throw new ApiError(404);
    }

    const endIndex = _.findIndex(
        elements,
        isLanguageHeader,
        norwegianHeaderIndex + 1
    );

    return elements.slice(norwegianHeaderIndex + 1, endIndex);
}

function isLanguageHeader(element) {
    return element.tagName === "H2";
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
    return {
        etymology: parseEtymology(elements),
        subEntries: parseSubEntries(elements),
        synonyms: parseSynonyms(elements),
        derived: parseDerivedTerms(elements)
    };
}

function getSection(elements, header) {
    const headerIndex = elements.findIndex(
        e => isHeader(e) && e.textContent === header
    );

    if (headerIndex === -1) {
        return null;
    }

    const nextHeaderIndex = _.findIndex(elements, isHeader, headerIndex + 1);

    if (nextHeaderIndex !== -1) {
        return elements.slice(headerIndex + 1, nextHeaderIndex);
    } else {
        return elements.slice(headerIndex + 1);
    }
}

function parseEtymology(elements) {
    let etymologySection = getSection(elements, "Etymology");
    if (etymologySection === null) {
        const firstHeaderIndex = elements.findIndex(isHeader);
        etymologySection = elements.slice(0, firstHeaderIndex);
    }

    if (etymologySection.length === 0) {
        return null;
    }

    return textContentParser.parse(...etymologySection);
}

function parseSubEntries(elements) {
    const types = elements.filter(isPartOfSpeechHeader).map(e => e.textContent);
    const subEntrySections = types.map(t => getSection(elements, t));

    return _.zip(types, subEntrySections).map(([type, section]) => ({
        type,
        term: textContentParser.parse(section[0]),
        senses: Array.from(section[1].children).map(parseSense)
    }));
}

function isPartOfSpeechHeader(element) {
    return isHeader(element) && partOfSpeechTypes.includes(element.textContent);
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

function parseSynonyms(elements) {
    const section = getSection(elements, "Synonyms");

    if (section === null) {
        return [];
    }

    return Array.from(section[0].children).map(textContentParser.parse);
}

function parseDerivedTerms(elements) {
    const section = getSection(elements, "Derived terms");

    if (section === null) {
        return [];
    }

    const listItems = section
        .map(e => Array.from(e.querySelectorAll("li")))
        .flat();

    return listItems.map(textContentParser.parse);
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
