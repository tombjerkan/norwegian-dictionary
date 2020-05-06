import React from "react";
import NavigationButton from "components/NavigationButton";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";

export default function SearchNavigationButton() {
    return (
        <NavigationButton to="/">
            <Chevron className="h-3 mr-3 stroke-current transform rotate-180" />
            <Magnifier className="h-4 stroke-current" />
        </NavigationButton>
    );
}
