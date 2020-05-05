import React from "react";
import classNames from "classnames";
import Link from "components/Link";
import styles from "./styles.module.css";

interface Props {
    to: string;
    children: React.ReactNode;
    className?: string;
}
export default function NavigationButton(props: Props) {
    return (
        <Link to={props.to}>
            <button className={classNames(styles.button, props.className)}>
                {props.children}
            </button>
        </Link>
    );
}
