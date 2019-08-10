import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function SubDefinition({ subDefinition }) {
    if (subDefinition === null) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.definition}>
                <TextWithLinks text={subDefinition.definition} />
            </div>
            <div className={styles.examples}>
                <TextWithLinks text={subDefinition.examples} />
            </div>
        </div>
    );
}
