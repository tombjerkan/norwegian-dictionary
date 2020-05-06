import React from "react";
import { ReactComponent as Chevron } from "components/Chevron.svg";

interface Props {
    onClose(): void;
}

export default function CloseButton(props: Props) {
    return (
        <button
            onClick={props.onClose}
            className="flex justify-center items-center w-full h-10 bg-gray-100"
        >
            <Chevron className="w-3 transform rotate-180" />
        </button>
    );
}
