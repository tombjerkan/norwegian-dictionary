import React from "react";
import styles from "./styles.module.css";

export function Header({ children }) {
    return <h3 className={styles.header}>{children}</h3>;
}

export function SubHeader({ children }) {
    return <h4 className={styles.subHeader}>{children}</h4>;
}
