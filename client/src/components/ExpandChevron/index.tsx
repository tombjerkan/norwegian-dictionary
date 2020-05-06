import React from "react";
import classNames from "classnames";
import { ReactComponent as Chevron } from "components/Chevron.svg";

interface Props {
    isOpen: boolean;
    className?: string;
}

export default function ExpandChevron(props: Props) {
    return (
        <Chevron
            className={classNames(
                "w-3",
                props.isOpen && "transform rotate-180",
                props.className
            )}
        />
    );
}
