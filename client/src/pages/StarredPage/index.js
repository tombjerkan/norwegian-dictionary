import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "components/Navigation";
import Link from "components/Link";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchNavigationButton from "./SearchNavigationButton";
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

    return <StarredPageView entries={entries} onDelete={deleteEntry} />;
}

export function StarredPageView({ entries, onDelete }) {
    return (
        <div>
            <Navigation>
                <SearchNavigationButton />
            </Navigation>

            <MaxWidthLimit>
                <StarredEntries>
                    {entries.map(entry => (
                        <StarredEntry
                            term={entry.term}
                            notes={entry.notes}
                            onDelete={() => onDelete(entry.term)}
                        />
                    ))}
                </StarredEntries>
            </MaxWidthLimit>
        </div>
    );
}

function StarredEntries({ children }) {
    return (
        <div className={styles.starred}>
            <h2 className={styles.header}>Starred</h2>

            <ul className={styles.entries}>{children}</ul>
        </div>
    );
}

function StarredEntry({ term, notes, onDelete }) {
    return (
        <li className={styles.entry}>
            <h3 className={styles.term}>
                <Link to={`/search/${term}`}>{term}</Link>
            </h3>

            <button onClick={onDelete} className={styles.removeButton}>
                Remove
            </button>

            <p className={styles.notes}>{notes}</p>
        </li>
    );
}
