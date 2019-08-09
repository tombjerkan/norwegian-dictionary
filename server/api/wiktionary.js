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

        const sections = separateByHeaders(norwegianSection, 3);
        delete sections["Pronunciation"];
        delete sections["References"];

        if (Object.keys(sections).some(key => /Etymology \d+/.test(key))) {
            const entries = Object.values(sections).map(parseEntry);
            res.json(entries);
        } else {
            const entries = [parseIndividualEntry(norwegianSection)];
            res.json(entries);
        }
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

function parseIndividualEntry(elements) {
    const sections = separateByHeaders(elements, 3);

    const etymologySection = sections["Etymology"];
    const etymology =
        etymologySection !== undefined
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

    const type = Object.keys(sections).find(key => types.includes(key));
    const term = textContentParser.parse(sections[type][0]);
    const senses = Array.from(sections[type][1].children).map(parseSense);

    const subSections = separateByHeaders(sections[type], 4);
    const synonymsSubSection = subSections["Synonyms"];
    const synonyms =
        synonymsSubSection !== undefined
            ? Array.from(synonymsSubSection[0].children).map(li =>
                  textContentParser.parse(li)
              )
            : [];

    // Header indentation level of 'Derived terms' differs from entry to entry
    const derived = parseDerivedTerms(
        sections["Derived terms"] || subSections["Derived terms"]
    );

    return {
        etymology,
        type,
        term,
        senses,
        synonyms,
        derived
    };
}

function parseEntry(elements) {
    let etymology = null;
    if (elements[0].tagName === "P") {
        etymology = textContentParser.parse(elements[0]);
    }

    const type = textContentParser.parse(
        elements.find(e => e.tagName === "H4")
    );
    const sections = separateByHeaders(elements, 4);
    const term = textContentParser.parse(sections[type][0]);
    const senses = Array.from(sections[type][1].children).map(parseSense);

    const subSections = separateByHeaders(sections[type], 5);
    const synonymsSubSection = subSections["Synonyms"];
    const synonyms =
        synonymsSubSection !== undefined
            ? Array.from(synonymsSubSection[0].children).map(li =>
                  textContentParser.parse(li)
              )
            : [];

    // Header indentation level of 'Derived terms' differs from entry to entry
    const derived = parseDerivedTerms(
        sections["Derived terms"] || subSections["Derived terms"]
    );

    return {
        etymology,
        type,
        term,
        senses,
        synonyms,
        derived
    };
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

    const listItems = Array.from(elements[0].querySelectorAll("li"));
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
