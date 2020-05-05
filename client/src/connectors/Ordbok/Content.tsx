import React from "react";
import DomPurify from "dompurify";

import { Entry } from "./types";
import styles from "./styles.module.css";

interface Props {
    data: Entry[];
}

export default function OrdbokContent(props: Props) {
    const sanitisedData = props.data.map(entry => ({
        term: entry.term,
        content: DomPurify.sanitize(entry.content)
    }));

    return (
        <>
            {sanitisedData.map(entry => (
                <>
                    <h1>{entry.term}</h1>
                    <div
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                        className={styles.container}
                    />
                </>
            ))}
        </>
    );
}
