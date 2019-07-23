const _ = require("lodash");

function removeChildrenByClassName(root, className) {
    const elements = root.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function removeChildrenByTagName(root, tagName) {
    const elements = root.getElementsByTagName(tagName);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function takeTextContentUntil(root, querySelector) {
    const endElement = root.querySelector(querySelector);

    if (endElement === null) {
        return root.textContent;
    } else {
        return _.takeWhile(root.childNodes, node => node !== endElement)
            .map(node => node.textContent)
            .join("");
    }
}

module.exports = { removeChildrenByClassName, removeChildrenByTagName, takeTextContentUntil };