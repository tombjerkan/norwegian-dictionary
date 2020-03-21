import React from "react"
import styles from "./styles.module.css";

export default function CloseButton({ onClose }) {
    return (
        <button onClick={onClose} className={styles.closeButton}>
            <Chevron className={styles.buttonChevron} />
        </button>
    );
}