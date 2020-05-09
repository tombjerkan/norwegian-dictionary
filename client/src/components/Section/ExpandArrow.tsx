import React from "react";
import classNames from "classnames";
import { ReactComponent as Chevron } from "components/Chevron.svg";

interface Props {
    isOpen: boolean;
}

export default function Header(props: Props) {
    return (
        <Chevron
            className={classNames(
                "w-3",
                props.isOpen && "transform rotate-180"
            )}
        />
    );
}
