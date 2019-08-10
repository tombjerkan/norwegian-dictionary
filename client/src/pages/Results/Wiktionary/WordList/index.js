import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function WordList({ title, words }) {
    return (
        <React.Fragment>
            <h4 className={styles.title}>{title}</h4>
            <TextWithLinks text={words.join(", ")} />
        </React.Fragment>
    );
}
