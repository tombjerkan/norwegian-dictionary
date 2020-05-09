import React from "react";
import classNames from "classnames";

interface Props {
    children: React.ReactNode;
    className?: string;
    onClick?(): void;
}

export default function Header(props: Props) {
    return (
        <div
            onClick={props.onClick}
            className={classNames(
                "flex items-center px-4 py-4",
                props.className
            )}
        >
            {props.children}
        </div>
    );
}
