const _ = require("lodash");

class TextContentParser {
    constructor(isLink, getWordLinkedTo) {
        this.isLink = isLink;
        this.getWordLinkedTo = getWordLinkedTo;

        this.parse = this.parse.bind(this);
        this.parseNode = this.parseNode.bind(this);
    }

    parse(...nodes) {
        return this.parseNodes(...nodes).trim();
    }

    parseNodes(...nodes) {
        return nodes.map(this.parseNode).join("");
    }

    parseNode(node) {
        if (isElementNode(node) && this.isLink(node)) {
            const textContent = this.parseNodes(...node.childNodes);
            const to = this.getWordLinkedTo(node);
            return `<Link to='${_.escape(to)}'>${textContent}</Link>`;
        } else if (isElementNode(node)) {
            return this.parseNodes(...node.childNodes);
        } else if (isTextNode(node)) {
            return _.escape(node.data);
        } else {
            return "";
        }
    }
}

function isElementNode(node) {
    return node.nodeType === 1;
}

function isTextNode(node) {
    return node.nodeType === 3;
}

module.exports = TextContentParser;
