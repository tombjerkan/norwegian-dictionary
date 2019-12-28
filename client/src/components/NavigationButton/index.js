import React from "react";
import Link from "components/Link";
import styles from "./styles.module.css";

export default function NavigationButton({ to, children }) {
    return (
        <Link to={to}>
            <button className={styles.button}>{children}</button>
        </Link>
    );
}
