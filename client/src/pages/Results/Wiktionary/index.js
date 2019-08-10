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

            {entry.etymology && <Etymology etymology={entry.etymology} />}

            {entry.subEntries.map(subEntry => (
                <SubEntry subEntry={subEntry} />
            ))}

            {entry.synonyms.length > 0 && (
                <WordList title="Synonyms" words={entry.synonyms} />
            )}
            {entry.derived.length > 0 && (
                <WordList title="Derived terms" words={entry.derived} />
            )}
        </li>
    );
}

function Etymology({ etymology }) {
    return (
        <p className={styles.etymology}>
            <TextWithLinks text={etymology} />
        </p>
    );
}

function SubEntry({ subEntry }) {
    return (
        <React.Fragment>
            <SubEntryHeader type={subEntry.type} term={subEntry.term} />

            <ol className={styles.sensesList}>
                {subEntry.senses.map(sense => (
                    <Sense sense={sense} />
                ))}
            </ol>
        </React.Fragment>
    );
}

function SubEntryHeader({ type, term }) {
    return (
        <div className={styles.subEntryHeader}>
            <div className={styles.type}>{type}</div>
            <div className={styles.term}>
                <TextWithLinks text={term} />
            </div>
        </div>
    );
}

function Sense({ sense }) {
    return (
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
    );
}

function WordList({ title, words }) {
    return (
        <React.Fragment>
            <h4 className={styles.wordListTitle}>{title}</h4>
            <TextWithLinks text={words.join(", ")} />
        </React.Fragment>
    );
}

export default Wiktionary;
