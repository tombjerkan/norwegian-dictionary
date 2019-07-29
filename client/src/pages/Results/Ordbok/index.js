import React from "react";
import { Link } from "react-router-dom";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import styles from "./styles.module.css";

function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`, []);

    return (
        <Section id="ordbok" title="Ordbok" isLoading={isLoading} error={error}>
            <ul className={styles.entriesList}>
                {data.map(entry => (
                    <Entry entry={entry} />
                ))}
            </ul>
        </Section>
    );
}

function Entry({ entry }) {
    return (
        <li>
            <h3 className={styles.term}>
                <TextWithLinks text={entry.term} />
            </h3>
            <div className={styles.etymology}>
                <TextWithLinks text={entry.etymology} />
            </div>
            <Senses senses={entry.senses} />
        </li>
    );
}

function Senses({ senses }) {
    if (senses.length === 0) {
        return null;
    }

    return (
        <ol className={styles.sensesList}>
            {senses.map(sense => (
                <li>
                    <div className={styles.definition}>
                        <TextWithLinks text={sense.definition} />
                    </div>

                    <div className={styles.examples}>
                        <TextWithLinks text={sense.examples} />
                    </div>

                    {sense.subDefinitions.map(subDefinition => (
                        <SubDefinition subDefinition={subDefinition} />
                    ))}

                    <SubEntries subEntries={sense.subEntries} />
                </li>
            ))}
        </ol>
    );
}

function SubDefinition({ subDefinition }) {
    if (subDefinition === null) {
        return null;
    }

    return (
        <div className={styles.subDefinitionContainer}>
            <div className={styles.subDefinition}>
                <TextWithLinks text={subDefinition.definition} />
            </div>
            <div className={styles.subDefinitionExamples}>
                <TextWithLinks text={subDefinition.examples} />
            </div>
        </div>
    );
}

function SubEntries({ subEntries }) {
    if (subEntries.length === 0) {
        return null;
    }

    return (
        <ul className={styles.subEntriesList}>
            {subEntries.map(subEntry => (
                <li>
                    <span className={styles.subEntryTerm}>
                        <TextWithLinks text={subEntry.term} />
                    </span>{" "}
                    <TextWithLinks text={subEntry.definition} />
                </li>
            ))}
        </ul>
    );
}

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
                    if (`/${to}` === window.location.pathname) {
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

export default Ordbok;
