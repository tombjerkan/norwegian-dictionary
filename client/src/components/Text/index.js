import React from "react";
import useHistory from "components/useHistory";
import styles from "./styles.module.css";

export default function Text({ text }) {
    const [location, push] = useHistory();

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
        <>
            {Array.from(textNodes).map(node => {
                if (node.nodeType === 1 && node.tagName === "Link") {
                    const to = node.getAttribute("to");

                    // Do not insert a link if already on linked page
                    if (`/${to}` === location.pathname) {
                        return node.textContent;
                    }

                    function handleClick(event) {
                        event.preventDefault();
                        push(`/${to}`);
                    }

                    return (
                        <a
                            href={to}
                            onClick={handleClick}
                            className={styles.link}
                        >
                            {node.textContent}
                        </a>
                    );
                } else if (node.nodeType === 1) {
                    console.warn(`Invalid element in text: ${text}`);
                    return node.textContent;
                } else if (node.nodeType === 3) {
                    return node.textContent;
                } else {
                    return "";
                }
            })}
        </>
    );
}
