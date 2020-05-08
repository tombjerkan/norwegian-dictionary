import React from "react";
import classNames from "classnames";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Navigation(props: Props) {
    return (
        <nav className={classNames("bg-gray-800", props.className)}>
            <div className="max-width-limit flex pt-3 pb-3">
                {props.children}
            </div>
        </nav>
    );
}
