import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`, []);

    return (
        <Section
            title="Ordbok"
            isLoading={isLoading}
            error={error}
            data-testid="ordbok"
        >
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
