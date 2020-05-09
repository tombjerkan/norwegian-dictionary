import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";

export default function Loading() {
    return (
        <div>
            <div
                className={classNames(
                    "inline-block rounded-full w-2 h-2 bg-gray-500",
                    styles.circle,
                    styles.circle1
                )}
            />
            <div
                className={classNames(
                    "inline-block rounded-full w-2 h-2 ml-2 bg-gray-500",
                    styles.circle,
                    styles.circle2
                )}
            />
            <div
                className={classNames(
                    "inline-block rounded-full w-2 h-2 ml-2 bg-gray-500",
                    styles.circle
                )}
            />
        </div>
    );
}
