import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import Tabs from "components/Tabs";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";
import { getAll, remove } from "storage/starred";

export default function Starred({ history, match }) {
    const [entries, setEntries] = useState([]);

    useEffect(() => setEntries(getAll()), []);

    return (
        <div>
            <nav className={styles.navigationBar}>
                <MaxWidthLimit>
                    <Tabs />
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <ul className={styles.entryList}>
                        {entries.map(entry => (
                            <li className={styles.entry}>
                                <Link to={`/results/${entry.word}`}>
                                    <h3>{entry.word}</h3>
                                </Link>
                                <button
                                    onClick={() => {
                                        remove(entry.word);
                                        setEntries(
                                            entries.filter(
                                                e => e.word !== entry.word
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
