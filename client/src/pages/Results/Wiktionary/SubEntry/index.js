import React from "react";
import TextWithLinks from "components/TextWithLinks";
import Sense from "./Sense";
import styles from "./styles.module.css";

export default function SubEntry({ subEntry }) {
    return (
        <div className={styles.container}>
            <h4 className={styles.header}>{subEntry.type}</h4>

            <p className={styles.term}>
                <TextWithLinks text={subEntry.term} />
            </p>

            <ol className={styles.senses}>
                {subEntry.senses.map(sense => (
                    <Sense sense={sense} />
                ))}
            </ol>
        </div>
    );
}
