import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

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
                className={
                    "w-120 bg-white p-8 rounded-lg grid grid-columns-buttons-2 grid-rows-button-modal gap-6"
                }
            >
                <textarea
                    className={
                        "rounded border resize-none p-3 h-40 col-start-1 col-end-4 row-start-1 row-end-2"
                    }
                    value={notes}
                    placeholder="Enter notes..."
                    onChange={event => setNotes(event.target.value)}
                />

                <button
                    className="col-start-2 col-end-3 row-start-2 row-end-3"
                    onClick={props.onCancel}
                >
                    Cancel
                </button>

                <button
                    className="col-start-3 col-end-4 row-start-2 row-end-3"
                    onClick={() => props.onSave(notes)}
                >
                    Ok
                </button>
            </div>
        </div>,
        document.getElementById("modalRoot")!
    );
}
