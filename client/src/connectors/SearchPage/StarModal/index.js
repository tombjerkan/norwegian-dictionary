import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";

export default function StarModal({ initialNotes, onSave, onCancel }) {
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setNotes(initialNotes || "");
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

                <button className={styles.cancel} onClick={onCancel}>
                    Cancel
                </button>

                <button className={styles.ok} onClick={() => onSave(notes)}>
                    Ok
                </button>
            </div>
        </div>,
        document.getElementById("modalRoot")
    );
}
