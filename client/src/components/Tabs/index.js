import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./styles.module.css";

export default function Tabs() {
    const currentPath = window.location.pathname;
    const isCurrentPageSearch = currentPath.startsWith("/results/");
    const isCurrentPageStarred = currentPath === "/starred";

    return (
        <div className={styles.container}>
            <Link
                to="/"
                className={classNames(
                    styles.tab,
                    isCurrentPageSearch && styles.currentTab
                )}
            >
                Search
            </Link>

            <Link
                to="/starred"
                className={classNames(
                    styles.tab,
                    isCurrentPageStarred && styles.currentTab
                )}
            >
                Starred
            </Link>
        </div>
    );
}
