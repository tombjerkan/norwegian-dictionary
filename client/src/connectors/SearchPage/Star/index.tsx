import React, { useState } from "react";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import StarModal from "../StarModal";
import { Entry } from "../types";
import styles from "./styles.module.css";

interface Props {
    entry: Entry | null;
    postEntry(notes: string): void;
}

export default function Star(props: Props) {
    const [isEditingNotes, setEditingNotes] = useState(false);

    const isStarred = isEditingNotes || props.entry !== null;

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
                    initialNotes={props.entry?.notes}
                    onSave={(notes: string) => {
                        setEditingNotes(false);
                        props.postEntry(notes);
                    }}
                    onCancel={() => {
                        setEditingNotes(false);
                    }}
                />
            )}
        </div>
    );
}
