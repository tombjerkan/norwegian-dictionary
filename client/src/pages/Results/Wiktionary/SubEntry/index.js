import React from "react";
import TextWithLinks from "components/TextWithLinks";
import Senses from "pages/Results/Wiktionary/Senses";
import styles from "./styles.module.css";

export default function SubEntry({ subEntry }) {
    return (
        <React.Fragment>
            <div className={styles.header}>
                <div className={styles.type}>{subEntry.type}</div>
                <div className={styles.term}>
                    <TextWithLinks text={subEntry.term} />
                </div>
            </div>

            <Senses senses={subEntry.senses} />
        </React.Fragment>
    );
}
