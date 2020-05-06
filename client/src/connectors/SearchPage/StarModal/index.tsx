import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
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
        <div className="fixed flex justify-center items-center inset-0 bg-gray-800 bg-opacity-50 z-10">
            <div
                className={classNames(
                    "bg-white p-8 rounded-lg",
                    styles.innerContainer
                )}
            >
                <textarea
                    className={classNames(
                        "rounded border resize-none p-3 h-40",
                        styles.notes
                    )}
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
