import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "components/Navigation";
import Link from "components/Link";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchNavigationButton from "./SearchNavigationButton";
import { Entry } from "../SearchPage/types";
import styles from "./styles.module.css";

export default function StarredPageContainer() {
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        axios
            .get("/api/starred")
            .then(response => setEntries(response.data))
            .catch(() => {});
    }, []);

    function deleteEntry(term: string) {
        setEntries(entries.filter(v => v.term !== term));
        axios.delete(`/api/starred/${term}`);
    }

    return <StarredPageView entries={entries} onDelete={deleteEntry} />;
}

interface Props {
    entries: Entry[];
    onDelete(term: string): void;
}

export function StarredPageView(props: Props) {
    return (
        <div>
            <Navigation>
                <SearchNavigationButton />
            </Navigation>

            <MaxWidthLimit>
                <StarredEntries>
                    {props.entries.map(entry => (
                        <StarredEntry
                            term={entry.term}
                            notes={entry.notes}
                            onDelete={() => props.onDelete(entry.term)}
                        />
                    ))}
                </StarredEntries>
            </MaxWidthLimit>
        </div>
    );
}

interface StarredEntriesProps {
    children: React.ReactNode;
}

function StarredEntries(props: StarredEntriesProps) {
    return (
        <div className={styles.starred}>
            <h2 className={styles.header}>Starred</h2>

            <ul className={styles.entries}>{props.children}</ul>
        </div>
    );
}

interface StarredEntryProps {
    term: string;
    notes: string;
    onDelete(): void;
}

function StarredEntry(props: StarredEntryProps) {
    return (
        <li className={styles.entry}>
            <h3 className={styles.term}>
                <Link to={`/search/${props.term}`}>{props.term}</Link>
            </h3>

            <button onClick={props.onDelete} className={styles.removeButton}>
                Remove
            </button>

            <p className={styles.notes}>{props.notes}</p>
        </li>
    );
}
