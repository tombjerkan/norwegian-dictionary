import React from "react";
import styles from "./styles.module.css";

export default function WiktionaryContent({ data }) {
    const parser = new DOMParser();
    const dataDocument = parser.parseFromString(data, "text/xml");
    const nodes = dataDocument.childNodes[0].childNodes;

    return <>{Array.from(nodes).map(convertNode)}</>;
}

function convertNode(node) {
    if (!isElement(node) && !isText(node)) {
        return null;
    }

    if (isText(node)) {
        return node.textContent;
    }

    const className = tagNameToClassName[node.tagName];
    const Component = node.tagName;

    const attributes = Object.assign(
        {},
        ...Array.from(node.attributes).map(attribute => ({
            [attribute.name]: attribute.value
        }))
    );

    return (
        <Component className={className} {...attributes}>
            {Array.from(node.childNodes).map(convertNode)}
        </Component>
    );
}

const tagNameToClassName = {
    h3: styles.header3,
    h4: styles.header4,
    h5: styles.header5,
    ol: styles.orderedList,
    ul: styles.unorderedList,
    li: styles.listItem,
    dl: styles.descriptionList,
    dd: styles.descriptionDetails,
    dt: styles.descriptionTerm,
    p: styles.paragraph,
    i: styles.italics,
    b: styles.bold,
    strong: styles.strong,
    a: styles.anchor,
    abbr: React.Fragment
};

function isElement(node) {
    return node.nodeType === 1;
}

function isText(node) {
    return node.nodeType === 3;
}
