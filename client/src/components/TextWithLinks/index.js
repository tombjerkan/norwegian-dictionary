import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function TextWithLinks({ text }) {
    if (!text) {
        return "";
    }

    // Text content does not have root element, so would be invalid if dummy
    // root not added
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(
        `<Root>${text}</Root>`,
        "text/xml"
    );
    const textNodes = xmlDocument.childNodes[0].childNodes;

    return (
        <React.Fragment>
            {Array.from(textNodes).map(node => {
                if (node.nodeType === 1 && node.tagName === "Link") {
                    const to = node.getAttribute("to");

                    // Do not insert a link if already on linked page
                    if (isCurrentPageWord(to)) {
                        return node.textContent;
                    }

                    return (
                        <Link to={to} className={styles.link}>
                            {node.textContent}
                        </Link>
                    );
                } else if (node.nodeType === 1) {
                    return "<Invalid element>";
                } else if (node.nodeType === 3) {
                    return node.textContent;
                } else {
                    return "";
                }
            })}
        </React.Fragment>
    );
}

function isCurrentPageWord(word) {
    return `/${word}` === window.location.pathname;
}

export default TextWithLinks;
