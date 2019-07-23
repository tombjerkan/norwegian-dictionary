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

function takeTextContentUntilClass(element, className) {
    const nodeList = _.takeWhile(
        element.childNodes,
        node => !(node.classList && node.classList.contains(className))
    );

    return nodeList.map(node => node.textContent).join("");
}

module.exports = { removeChildrenByClassName, removeChildrenByTagName, takeTextContentUntilClass };