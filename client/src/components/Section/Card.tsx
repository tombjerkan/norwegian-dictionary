import React from "react";
import classNames from "classnames";

interface Props {
    children: React.ReactNode;
    isDisabled?: boolean;
    className?: string;
}

export default function Card(props: Props) {
    return (
        <section
            className={classNames(
                "shadow rounded-lg overflow-hidden bg-white",
                props.isDisabled && "opacity-50",
                props.className
            )}
        >
            {props.children}
        </section>
    );
}
