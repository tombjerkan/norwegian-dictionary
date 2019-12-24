import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabs from "components/Tabs";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";

function useStarred() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios.get("/api/starred")
            .then(response => setEntries(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, []);

    function deleteEntry(term) {
        setEntries(entries.filter(v => v.term !== term));
        axios.delete(`/api/starred/${term}`);
    }

    return [entries, deleteEntry, isLoading, error];
}

export default function Starred({ history, match }) {
    const [entries, deleteEntry] = useStarred();

    return (
        <div>
            <nav className={styles.navigationBar}>
                <MaxWidthLimit>
                    <Tabs />
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <h1 className={styles.header}>Starred</h1>

                    <ul className={styles.entryList}>
                        {entries.map(entry => (
                            <li className={styles.entry}>
                                <Link to={`/results/${entry.term}`}>
                                    <h3>{entry.term}</h3>
                                </Link>
                                <button
                                    onClick={() => {
                                        deleteEntry(entry.term);
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
