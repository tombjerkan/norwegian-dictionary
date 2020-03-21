import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

export default function Section({ children, isAvailable = true, className }) {
    return (
        <section
            className={classNames(
                styles.section,
                !isAvailable && styles.unavailable,
                className
            )}
        >
            {children}
        </section>
    );
}
