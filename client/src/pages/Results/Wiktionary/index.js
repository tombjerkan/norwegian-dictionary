import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

function Wiktionary({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`, []);

    return (
        <Section
            title="Wiktionary"
            isLoading={isLoading}
            error={error}
            data-testid="wiktionary"
        >
            <ul className={styles.entriesList}>
                {data.map((entry, index) => (
                    <Entry entry={entry} index={index} />
                ))}
            </ul>
        </Section>
    );
}

function Entry({ index, entry }) {
    return (
        <li>
            <h3 className={styles.entryHeader}>Etymology {index + 1}</h3>

            {entry.etymology && (
                <p className={styles.etymology}>
                    <TextWithLinks text={entry.etymology} />
                </p>
            )}

            <div className={styles.description}>
                <div className={styles.type}>{entry.type}</div>
                <div className={styles.term}>
                    <TextWithLinks text={entry.term} />
                </div>
            </div>

            <ol className={styles.sensesList}>
                {entry.senses.map(sense => (
                    <li>
                        <TextWithLinks text={sense.definition} />

                        {sense.examples && (
                            <ul className={styles.examplesList}>
                                {sense.examples.map(example => (
                                    <li>
                                        <TextWithLinks text={example} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ol>

            {entry.synonyms.length > 0 && (
                <React.Fragment>
                    <h4 className={styles.synonymsHeader}>Synonyms</h4>
                    <TextWithLinks text={entry.synonyms.join()} />
                </React.Fragment>
            )}
        </li>
    );
}

export default Wiktionary;
