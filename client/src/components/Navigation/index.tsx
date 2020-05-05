import React from "react";
import classNames from "classnames";
import MaxWidthLimit from "components/MaxWidthLimit";
import styles from "./styles.module.css";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Navigation(props: Props) {
    return (
        <nav className={classNames(styles.outerContainer, props.className)}>
            <MaxWidthLimit>
                <div className={styles.innerContainer}>{props.children}</div>
            </MaxWidthLimit>
        </nav>
    );
}
