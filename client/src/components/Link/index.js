import React from "react";
import classNames from "classnames";
import { history } from "routing";
import styles from "./styles.module.css";

export default function Link({ to, children, className }) {
    function handleClick(event) {
        event.preventDefault();
        history.push(to);
    }

    return (
        <a
            href={to}
            onClick={handleClick}
            className={classNames(styles.link, className)}
        >
            {children}
        </a>
    );
}
