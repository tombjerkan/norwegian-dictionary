import React, { useState } from "react";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import StarModal from "../StarModal";
import styles from "./styles.module.css";

export default function Star({ entry, postEntry }) {
    const [isEditingNotes, setEditingNotes] = useState(false);

    const isStarred = isEditingNotes || entry !== null;

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
                <StarModal
                    initialNotes={entry !== null && entry.notes}
                    onSave={notes => {
                        setEditingNotes(false);
                        postEntry(notes);
                    }}
                    onCancel={() => {
                        setEditingNotes(false);
                    }}
                />
            )}
        </div>
    );
}
