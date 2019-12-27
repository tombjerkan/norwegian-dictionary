import React from "react";
import classNames from "classnames";
import Text from "components/Text";
import styles from "./styles.module.css";

export function Entry({ children }) {
    return <div className={styles.entry}>{children}</div>;
}

export function Header({ children }) {
    return <h3 className={styles.header}>{children}</h3>;
}

export function SubHeader({ children }) {
    return <h4 className={styles.subHeader}>{children}</h4>;
}

export function Etymology({ children }) {
    return <p className={styles.etymology}>{children}</p>;
}

export function SenseList({ children }) {
    return <ol className={styles.senseList}>{children}</ol>;
}

export function Sense({ children }) {
    return <li>{children}</li>;
}

export function Paragraph({ children, className }) {
    return (
        <p className={classNames(styles.paragraph, className)}>{children}</p>
    );
}

export function Examples({ children, className }) {
    return (
        <Paragraph className={classNames(styles.examples, className)}>
            {children}
        </Paragraph>
    );
}
