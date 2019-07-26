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

            {entry.senses.length > 0 &&
                <ol className={styles.sensesList}>
                    {entry.senses.map(sense =>
                        <li>
                            <div className={styles.definition}>{sense.definition}</div>

                            <div className={styles.examples}>{sense.examples}</div>

                            {sense.subDefinition &&
                                <div className={styles.subDefinitionContainer}>
                                    <div className={styles.subDefinition}>{sense.subDefinition.definition}</div>
                                    <div className={styles.subDefinitionExamples}>{sense.subDefinition.examples}</div>
                                </div>
                            }

                            {sense.subEntries.length > 0 &&
                                <ul className={styles.subEntriesList}>
                                    {sense.subEntries.map(subEntry =>
                                        <li>
                                            <span className={styles.subEntryTerm}>{subEntry.term}</span>
                                            {" "}
                                            {subEntry.definition}
                                        </li>
                                    )}
                                </ul>}
                        </li>
                    )}
                </ol>
            }
        </li>
    )
}

export default Ordbok;
