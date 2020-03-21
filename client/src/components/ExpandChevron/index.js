import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

export default function ExpandChevron({ isOpen, className }) {
    return (
        <Chevron
            className={classNames(
                styles.chevron,
                isOpen && styles.closeChevron,
                className
            )}
        />
    );
}
