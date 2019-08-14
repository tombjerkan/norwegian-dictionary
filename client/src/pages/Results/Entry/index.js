import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function Entry({ header, etymology, children }) {
    return (
        <div className={styles.container}>
            <h3 className={styles.header}>{header}</h3>

            <p className={styles.etymology}>
                <TextWithLinks text={etymology} />
            </p>

            {children}
        </div>
    );
}
