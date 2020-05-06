import React from "react";
import classNames from "classnames";
import MaxWidthLimit from "components/MaxWidthLimit";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Navigation(props: Props) {
    return (
        <nav className={classNames("bg-gray-800", props.className)}>
            <MaxWidthLimit>
                <div className="flex pt-3 pb-3">{props.children}</div>
            </MaxWidthLimit>
        </nav>
    );
}
