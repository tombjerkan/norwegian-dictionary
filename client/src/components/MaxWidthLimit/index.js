import React from "react";
import styles from "./styles.module.css";

export default function MaxWidthLimit({ children }) {
    return <div className={styles.container}>{children}</div>;
}
