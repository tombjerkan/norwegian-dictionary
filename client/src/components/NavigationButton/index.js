import React from "react";
import classNames from "classnames";
import Link from "components/Link";
import styles from "./styles.module.css";

export default function NavigationButton({ to, children, className }) {
    return (
        <Link to={to}>
            <button className={classNames(styles.button, className)}>{children}</button>
        </Link>
    );
}
