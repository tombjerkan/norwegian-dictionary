import React from "react";
import classNames from "classnames";
import styles from "./Loading.module.css";

export default function Loading() {
    return (
        <div>
            <Dot className={styles.circle1} />
            <Dot className={styles.circle2} />
            <Dot />
        </div>
    );
}

interface DotProps {
    className?: string;
}

function Dot(props: DotProps) {
    return (
        <div
            className={classNames(
                "inline-block rounded-full w-2 h-2 ml-2 bg-blue-500",
                styles.circle,
                props.className
            )}
        />
    );
}
