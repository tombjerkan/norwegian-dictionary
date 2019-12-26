import React from "react";
import MaxWidthLimit from "components/MaxWidthLimit";
import styles from "./styles.module.css";

export default function Navigation({ children }) {
    return (
        <nav className={styles.outerContainer}>
            <MaxWidthLimit>
                <div className={styles.innerContainer}>{children}</div>
            </MaxWidthLimit>
        </nav>
    );
}
