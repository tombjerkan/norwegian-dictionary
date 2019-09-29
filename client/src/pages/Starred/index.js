import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import _ from "lodash";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";

export default function Results({ history, match }) {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const numberOfStorageEntries = window.localStorage.length;
        setEntries(
            _.range(numberOfStorageEntries)
                .map(n => window.localStorage.key(n))
                .map(key => ({ key, notes: window.localStorage.getItem(key) }))
        );
    }, []);

    return (
        <div>
            <nav className={styles.navigationBar}>
                <MaxWidthLimit>
                    <div className={styles.tabs}>
                        <Link to="/" className={styles.tab}>
                            Search
                        </Link>
                        <div
                            className={classNames(styles.tab, styles.activeTab)}
                        >
                            Starred
                        </div>
                    </div>
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <ul className={styles.entryList}>
                        {entries.map(entry => (
                            <li className={styles.entry}>
                                <Link to={`/results/${entry.key}`}>
                                    <h3>{entry.key}</h3>
                                </Link>
                                <button
                                    onClick={() => {
                                        window.localStorage.removeItem(
                                            entry.key
                                        );
                                        setEntries(
                                            entries.filter(
                                                e => e.key !== entry.key
                                            )
                                        );
                                    }}
                                >
                                    Remove
                                </button>
                                <p>{entry.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </MaxWidthLimit>
        </div>
    );
}
