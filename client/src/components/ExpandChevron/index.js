import React from "react";
import classNames from "classnames";
import { ReactComponent as Chevron } from "components/Chevron.svg";
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
