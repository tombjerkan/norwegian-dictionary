import React from "react";
import TextWithLinks from "components/TextWithLinks";
import Senses from "pages/Results/Ordbok/Senses";
import styles from "./styles.module.css";

export default function Entries({ entries }) {
    return (
        <ul className={styles.container}>
            {entries.map(entry => (
                <li>
                    <h3 className={styles.term}>
                        <TextWithLinks text={entry.term} />
                    </h3>

                    <div className={styles.etymology}>
                        <TextWithLinks text={entry.etymology} />
                    </div>

                    <Senses senses={entry.senses} />
                </li>
            ))}
        </ul>
    );
}
