import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "routing";
import Navigation from "components/Navigation";
import Button from "components/Button";
import MaxWidthLimit from "components/MaxWidthLimit";
import Link from "components/Link";
import styles from "./styles.module.css";

export default function StarredPageContainer() {
    const [entries, setEntries] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        axios
            .get("/api/starred")
            .then(response => setEntries(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, []);

    function deleteEntry(term) {
        setEntries(entries.filter(v => v.term !== term));
        axios.delete(`/api/starred/${term}`);
    }

    return (
        <StarredPageView
            entries={entries}
            onClickSearch={() => history.push("/")}
            onDelete={deleteEntry}
        />
    );
}

export function StarredPageView({ entries, onClickSearch, onDelete }) {
    return (
        <div>
            <Navigation>
                <Button onClick={onClickSearch}>Search</Button>
            </Navigation>

            <MaxWidthLimit>
                <div className={styles.starred}>
                    <h2>Starred</h2>

                    <ul className={styles.entries}>
                        {entries.map(entry => (
                            <li className={styles.entry}>
                                <h3 className={styles.term}>
                                    <Link to={`/search/${entry.term}`}>
                                        {entry.term}
                                    </Link>
                                </h3>

                                <button
                                    onClick={() => {
                                        onDelete(entry.term);
                                    }}
                                    className={styles.removeButton}
                                >
                                    Remove
                                </button>

                                <p className={styles.notes}>{entry.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </MaxWidthLimit>
        </div>
    );
}
