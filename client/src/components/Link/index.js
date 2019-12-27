import React from "react";
import classNames from "classnames";
import useHistory from "components/useHistory";
import styles from "./styles.module.css";

export default function Link({ to, children, className }) {
    const [, push] = useHistory();

    function handleClick(event) {
        event.preventDefault();
        push(to);
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
