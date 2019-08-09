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

function takeChildNodesUntil(root, querySelector) {
    const endElement = root.querySelector(querySelector);
    return _.takeWhile(root.childNodes, node => node !== endElement);
}

module.exports = {
    removeElement,
    removeChildrenByClassName,
    removeChildrenByTagName,
    takeChildNodesUntil
};
