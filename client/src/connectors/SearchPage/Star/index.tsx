import React, { useState } from "react";
import classNames from "classnames";
import { ReactComponent as StarIcon } from "components/Star.svg";
import StarModal from "../StarModal";
import { Entry } from "../types";

interface Props {
    entry: Entry | null;
    postEntry(notes: string): void;
}

export default function Star(props: Props) {
    const [isEditingNotes, setEditingNotes] = useState(false);

    const isStarred = isEditingNotes || props.entry !== null;

    return (
        <div className="fixed right-0 bottom-0 mr-8 mb-8">
            <div className="bg-white w-12 h-12 rounded-full flex justify-center items-center cursor-pointer shadow text-blue-500 stroke-current">
                <StarIcon
                    onClick={() => {
                        setEditingNotes(true);
                    }}
                    className={classNames(
                        "w-6 transform translate-y-px",
                        isStarred && "fill-current"
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
