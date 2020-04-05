import React from "react";
import DomPurify from "dompurify";

import styles from "./styles.module.css";

export default function OrdbokContent({ data }) {
    const sanitisedData = data.map(entry => ({
        term: entry.term,
        content: DomPurify.sanitize(entry.content)
    }));

    return sanitisedData.map(entry => (
        <>
            <h1>{entry.term}</h1>
            <div
                dangerouslySetInnerHTML={{ __html: entry.content }}
                className={styles.container}
            />
        </>
    ));
}
