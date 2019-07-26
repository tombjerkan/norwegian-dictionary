import React from "react";
import Section from "src/pages/Results/Section";
import useFetch from "src/pages/Results/useFetch";
import styles from "./styles.module.css";

function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`);

    return (
        <Section title="Ordbok" isLoading={isLoading} error={error}>
            <ul className={styles.entriesList}>
                {data.map(entry => <Entry entry={entry} />)}
            </ul>
        </Section>
    );
}

function Entry({ entry }) {
    return (
        <li>
            <h3 className={styles.term}>{entry.term}</h3>
            <div className={styles.etymology}>{entry.etymology}</div>
            <Senses senses={entry.senses} />
        </li>
    )
}

function Senses({ senses }) {
    if (senses.length === 0) {
        return null;
    }

    return (
        <ol className={styles.sensesList}>
            {senses.map(sense =>
                <li>
                    <div className={styles.definition}>{sense.definition}</div>
                    <div className={styles.examples}>{sense.examples}</div>
                    <SubDefinition subDefinition={sense.subDefinition} />
                    <SubEntries subEntries={sense.subEntries} />
                </li>
            )}
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
                {subDefinition.definition}
            </div>
            <div className={styles.subDefinitionExamples}>
                {subDefinition.examples}
            </div>
        </div>
    )
}

function SubEntries({ subEntries }) {
    if (subEntries.length === 0) {
        return null;
    }

    return (
        <ul className={styles.subEntriesList}>
            {.subEntries.map(subEntry =>
                <li>
                    <span className={styles.subEntryTerm}>
                        {subEntry.term}
                    </span>
                    {" "}
                    {subEntry.definition}
                </li>
            )}
        </ul>
    );
}

export default Ordbok;
