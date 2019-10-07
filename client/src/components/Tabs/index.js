import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { ReactComponent as Star } from "components/Star.svg";
import { ReactComponent as Search } from "components/MagnifyingGlass.svg";
import styles from "./styles.module.css";

export default function Tabs() {
    const currentPath = window.location.pathname;
    const isCurrentPageSearch = currentPath.startsWith("/results/");
    const isCurrentPageStarred = currentPath === "/starred";

    return (
        <div className={styles.container}>
            <Tab to="/" isCurrent={isCurrentPageSearch}>
                <Search className={styles.icon} />
            </Tab>

            <Tab to="/starred" isCurrent={isCurrentPageStarred}>
                <Star className={styles.icon} />
            </Tab>
        </div>
    );
}

function Tab({ to, isCurrent, children }) {
    return (
        <Link
            to={to}
            className={classNames(styles.tab, isCurrent && styles.currentTab)}
        >
            {children}
        </Link>
    );
}
