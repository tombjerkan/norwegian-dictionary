import React, { useState, useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import styles from "./styles.module.css";

function useStarredEntry(term) {
    const [entry, setEntry] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setEntry(null);
        setLoading(true);
        setError(null);

        axios.get(`/api/starred/${term}`)
            .then(response => setEntry(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, [term]);

    function postEntry(term, notes) {
        setEntry({ term, notes });
        axios.post("/api/starred", { term, notes });
    }

    return [entry, postEntry, isLoading, error]
}

export default function Star({ query }) {
    const [entry, postEntry] = useStarredEntry(query);
    const [isEditingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState("");

    const isStarred = isEditingNotes || entry !== null;

    useEffect(() => {
        if (entry !== null) {
            setNotes(entry.notes);
        }
    }, [entry]);

    return (
        <div className={styles.container}>
            <div className={styles.starButton}>
                <StarIcon
                    onClick={() => {
                        setEditingNotes(true);
                    }}
                    className={classNames(
                        styles.star,
                        isStarred && styles.filled
                    )}
                />
            </div>

            {isEditingNotes && (
                <div className={styles.notesBubble}>
                    <textarea
                        className={styles.notes}
                        value={notes}
                        placeholder="Enter notes..."
                        onChange={event => setNotes(event.target.value)}
                    />

                    <button
                        className={styles.cancel}
                        onClick={() => {
                            setEditingNotes(false);
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className={styles.ok}
                        onClick={() => {
                            setEditingNotes(false);
                            postEntry(query, notes);
                        }}
                    >
                        Ok
                    </button>
                </div>
            )}
        </div>
    );
}
