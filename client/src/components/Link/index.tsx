import React from "react";
import classNames from "classnames";
import { history } from "routing";
import styles from "./styles.module.css";

interface Props {
    to: string;
    children: React.ReactNode;
    className?: string;
}

export default function Link(props: Props) {
    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        history.push(props.to);
    }

    return (
        <a
            href={props.to}
            onClick={handleClick}
            className={classNames(styles.link, props.className)}
        >
            {props.children}
        </a>
    );
}
