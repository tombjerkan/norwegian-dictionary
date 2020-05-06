import React from "react";
import NavigationButton from "components/NavigationButton";
import { ReactComponent as Star } from "components/Star.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";

export default function StarredNavigationButton() {
    return (
        <NavigationButton to="/starred">
            <Star className="h-6 fill-current" />
            <Chevron className="h-3 ml-3 stroke-current" />
        </NavigationButton>
    );
}
