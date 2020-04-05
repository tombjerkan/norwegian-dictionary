import React from "react";
import DomPurify from "dompurify";
import styles from "./styles.module.css";

export default function WiktionaryContent({ data }) {
    const sanitisedData = DomPurify.sanitize(data);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: sanitisedData }}
            className={styles.container}
        />
    );
}