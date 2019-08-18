import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

export default function Page({ children, className }) {
    return (
        <div className={classNames(styles.container, className)}>
            {children}
        </div>
    );
}
