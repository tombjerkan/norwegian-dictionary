const axios = require("axios");
const { Router } = require("express");
const { JSDOM } = require("jsdom");
const { handleAsyncErrors, ApiError } = require("./errorHandling");
const { removeChildrenByClassName } = require("./dom");

const router = Router();

router.get("/wiktionary/:word", handleAsyncErrors(async (req, res) => {
    let response;
    try {
        response = await axios.get(`https://en.wiktionary.org/wiki/${req.params.word}`);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new ApiError(404);
        } else {
            throw err;
        }
    }

    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    removeChildrenByClassName(document, "mw-editsection");
    removeSectionByHeader(document, "Derived terms");
    removeSectionByHeader(document, "References");
    removeSectionByHeader(document, "Pronunciation");

    const links = Array.from(document.querySelectorAll("a[href]"));
    for (link of links) {
        const match = link.getAttribute("href").match(/\/wiki\/(.*)#Norwegian_Bokmål/);
        if (match) {
            link.setAttribute("href", `/${match[1]}`);
        } else {
            link.replaceWith(...link.childNodes);
        }
    }

    const norwegianBokmaalElement = document.getElementById("Norwegian_Bokmål");
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
}));

function removeSectionByHeader(root, header) {
    const matches = Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).filter(element => element.textContent === header);

    for (match of matches) {
        let sibling = match.nextElementSibling;
        match.parentNode.removeChild(match);
        while (sibling !== null && !["H1", "H2", "H3", "H4", "H5", "H6"].includes(sibling.tagName)) {
            const temp = sibling.nextElementSibling;
            sibling.parentNode.removeChild(sibling);
            sibling = temp;
        }
    }
}

module.exports = router;