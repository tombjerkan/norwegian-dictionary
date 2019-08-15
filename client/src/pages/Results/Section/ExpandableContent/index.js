import React from "react";
import { Collapse } from "react-collapse";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import styles from "./styles.module.css";

export default function ExpandableContent({ isOpen, onCollapse, children }) {
    return (
        <Collapse isOpened={isOpen}>
            <article className={styles.content}>{children}</article>

            <button onClick={onCollapse} className={styles.collapseButton}>
                <Chevron className={styles.collapseChevron} />
            </button>
        </Collapse>
    );
}
