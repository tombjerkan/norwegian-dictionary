import React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

interface Props {
    children: React.ReactNode;
    isAvailable?: boolean;
    className?: string;
}

export default function Section({ isAvailable = true, ...props }: Props) {
    return (
        <section
            className={classNames(
                styles.section,
                !isAvailable && styles.unavailable,
                props.className
            )}
        >
            {props.children}
        </section>
    );
}
