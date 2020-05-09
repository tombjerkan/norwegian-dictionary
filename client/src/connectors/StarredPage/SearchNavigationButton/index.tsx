import React from "react";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";
import { history } from "routing";

export default function SearchNavigationButton() {
    function navigate(event: React.MouseEvent) {
        event.preventDefault();
        history.push("/");
    }
    return (
        <button
            onClick={navigate}
            className="flex items-center bg-white h-10 rounded-lg shadow pl-3 pr-3"
        >
            <Chevron className="h-3 mr-3 stroke-current transform rotate-180" />
            <Magnifier className="h-4 stroke-current" />
        </button>
    );
}
