const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const { withAsyncErrorHandling, ApiError } = require("./errorHandling");
const { removeElement, removeChildrenByClassName } = require("./dom");

const router = Router();

router.get(
    "/wiktionary/:word",
    withAsyncErrorHandling(async (req, res) => {
        const document = await fetchDocument(req.params.word);

        // Remove parts of the document that should not be included in the
        // result
        removeChildrenByClassName(document, "mw-editsection");
        removeSection(document, "Derived terms");
        removeSection(document, "References");
        removeSection(document, "Pronunciation");

        replaceLinks(document);

        const norwegianBokmaalElement = document.getElementById(
            "Norwegian_Bokmål"
        );
        if (norwegianBokmaalElement === null) {
            throw new ApiError(404);
        }

        const languageHeader = norwegianBokmaalElement.parentElement;
        const bokmaalElements = [];
        let currentElement = languageHeader.nextElementSibling;
        while (currentElement !== null && currentElement.tagName !== "H2") {
            bokmaalElements.push(currentElement);
            currentElement = currentElement.nextElementSibling;
        }

        res.json(bokmaalElements.map(element => element.outerHTML).join(""));
    })
);

async function fetchDocument(word) {
    try {
        const url = `https://en.wiktionary.org/wiki/${word}`;
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        return dom.window.document;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new ApiError(404);
        } else {
            throw err;
        }
    }
}

function replaceLinks(document) {
    const linkToAnotherWord = /\/wiki\/(.*)#Norwegian_Bokmål/;

    const links = document.querySelectorAll("a[href]");
    for (const link of links) {
        const match = link.getAttribute("href").match(linkToAnotherWord);
        if (match) {
            // Replace link href to point to own website's page
            link.setAttribute("href", `/${match[1]}`);
        } else {
            // Replace anchor element with its children to remove from document
            link.replaceWith(...link.childNodes);
        }
    }
}

function removeSection(root, header) {
    const allHeaders = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const matchingHeaders = Array.from(allHeaders)
        .filter(element => element.textContent === header);

    for (match of matchingHeaders) {
        let sibling = match.nextElementSibling;
        removeElement(match);

        const headerTagRegex = /^H[1-6]$/;
        while (sibling !== null && headerTagRegex.test(sibling.tagName)) {
            const nextSibling = sibling.nextElementSibling;
            removeElement(sibling);
            sibling = nextSibling;
        }
    }
}

module.exports = router;
