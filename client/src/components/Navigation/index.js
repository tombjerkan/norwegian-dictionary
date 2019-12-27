import React from "react";
import classNames from "classnames";
import MaxWidthLimit from "components/MaxWidthLimit";
import styles from "./styles.module.css";

export default function Navigation({ children, className }) {
    return (
        <nav className={classNames(styles.outerContainer, className)}>
            <MaxWidthLimit>
                <div className={styles.innerContainer}>{children}</div>
            </MaxWidthLimit>
        </nav>
    );
}
