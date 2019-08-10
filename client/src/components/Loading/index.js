import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

function Loading() {
    return (
        <div className={styles.container}>
            <div className={classNames(styles.circle, styles.circle1)} />
            <div className={classNames(styles.circle, styles.circle2)} />
            <div className={classNames(styles.circle, styles.circle3)} />
        </div>
    );
}

export default Loading;
