import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function SubEntries({ subEntries }) {
    if (subEntries.length === 0) {
        return null;
    }

    return (
        <ul className={styles.container}>
            {subEntries.map(subEntry => (
                <li>
                    <span className={styles.term}>
                        <TextWithLinks text={subEntry.term} />
                    </span>{" "}
                    <TextWithLinks text={subEntry.definition} />
                </li>
            ))}
        </ul>
    );
}
