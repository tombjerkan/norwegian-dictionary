import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import styles from "./styles.module.css";

export default function Star({ entry, postEntry }) {
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
                            postEntry(notes);
                        }}
                    >
                        Ok
                    </button>
                </div>
            )}
        </div>
    );
}
