import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function Etymology({ etymology }) {
    return (
        <p className={styles.container}>
            <TextWithLinks text={etymology} />
        </p>
    );
}
