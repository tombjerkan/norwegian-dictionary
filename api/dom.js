const _ = require("lodash");

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function removeChildrenByClassName(root, className) {
    const elements = root.getElementsByClassName(className);
    while (elements.length > 0) {
        removeElement(elements[0]);
    }
}

function removeChildrenByTagName(root, tagName) {
    const elements = root.getElementsByTagName(tagName);
    while (elements.length > 0) {
        removeElement(elements[0]);
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

module.exports = {
    removeElement,
    removeChildrenByClassName,
    removeChildrenByTagName,
    takeTextContentUntil
};
