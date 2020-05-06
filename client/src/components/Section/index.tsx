import React from "react";
import classNames from "classnames";

interface Props {
    children: React.ReactNode;
    isAvailable?: boolean;
    className?: string;
}

export default function Section({ isAvailable = true, ...props }: Props) {
    return (
        <section
            className={classNames(
                "shadow rounded-lg overflow-hidden bg-white",
                !isAvailable && "opacity-50",
                props.className
            )}
        >
            {props.children}
        </section>
    );
}
