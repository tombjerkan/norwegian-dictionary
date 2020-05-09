import React from "react";
import { ReactComponent as Star } from "components/Star.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";
import { history } from "routing";

export default function StarredNavigationButton() {
    function navigate(event: React.MouseEvent) {
        event.preventDefault();
        history.push("/starred");
    }

    return (
        <button
            onClick={navigate}
            className="flex items-center bg-white h-10 rounded-lg shadow pl-3 pr-3"
        >
            <Star className="h-6 fill-current" />
            <Chevron className="h-3 ml-3 stroke-current" />
        </button>
    );
}
