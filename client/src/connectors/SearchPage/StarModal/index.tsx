import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";

interface Props {
    initialNotes?: string;
    onSave(value: string): void;
    onCancel(): void;
}

export default function StarModal({ initialNotes = "", ...props }: Props) {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    return ReactDOM.createPortal(
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <textarea
                    className={styles.notes}
                    value={notes}
                    placeholder="Enter notes..."
                    onChange={event => setNotes(event.target.value)}
                />

                <button className={styles.cancel} onClick={props.onCancel}>
                    Cancel
                </button>

                <button
                    className={styles.ok}
                    onClick={() => props.onSave(notes)}
                >
                    Ok
                </button>
            </div>
        </div>,
        document.getElementById("modalRoot")!
    );
}
