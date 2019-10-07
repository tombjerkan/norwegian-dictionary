import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import styles from "./styles.module.css";

export default function Star({ query }) {
    const [isStarred, setStarred] = useState(false);
    const [isEditingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const storageEntry = window.localStorage.getItem(query);
        if (storageEntry === null) {
            setStarred(false);
            setNotes("");
        } else {
            setStarred(true);
            setNotes(storageEntry);
        }
    }, [query]);

    return (
        <div className={styles.container}>
            <div className={styles.starButton}>
                <StarIcon
                    onClick={() => {
                        setStarred(true);
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
                            setStarred(false);
                            setEditingNotes(false);
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        className={styles.ok}
                        onClick={() => {
                            setEditingNotes(false);
                            window.localStorage.setItem(query, notes);
                        }}
                    >
                        Ok
                    </button>
                </div>
            )}
        </div>
    );
}
