import React from "react";
import DomPurify from "dompurify";
import styles from "./styles.module.css";

interface Props {
    data: string;
}

export default function WiktionaryContent(props: Props) {
    const sanitisedData = DomPurify.sanitize(props.data);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: sanitisedData }}
            className={styles.container}
        />
    );
}
