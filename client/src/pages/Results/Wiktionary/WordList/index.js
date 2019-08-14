import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function WordList({ header, words }) {
    return (
        <div className={styles.container}>
            <h4 className={styles.header}>{header}</h4>

            <TextWithLinks text={words.join(", ")} />
        </div>
    );
}
