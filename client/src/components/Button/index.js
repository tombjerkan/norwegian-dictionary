import React from "react";
import styles from "./styles.module.css";

export default function Button({ onClick, children }) {
    return (
        <button onClick={onClick} className={styles.button}>
            {children}
        </button>
    );
}
