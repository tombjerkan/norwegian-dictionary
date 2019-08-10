import React from "react";
import Etymology from "pages/Results/Wiktionary/Etymology";
import SubEntry from "pages/Results/Wiktionary/SubEntry";
import WordList from "pages/Results/Wiktionary/WordList";
import styles from "./styles.module.css";

export default function Entries({ entries }) {
    return (
        <ul className={styles.container}>
            {entries.map((entry, index) => (
                <li>
                    <h3 className={styles.header}>Etymology {index + 1}</h3>

                    {entry.etymology && (
                        <Etymology etymology={entry.etymology} />
                    )}

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
            ))}
        </ul>
    );
}
