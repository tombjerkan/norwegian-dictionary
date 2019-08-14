import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function SubEntry({ subEntry }) {
    return (
        <div className={styles.container}>
            <span className={styles.term}>
                <TextWithLinks text={subEntry.term} />
            </span>{" "}
            <span className={styles.definition}>
                <TextWithLinks text={subEntry.definition} />
            </span>
        </div>
    );
}
