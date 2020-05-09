import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function Title(props: Props) {
    return (
        <h2 className="flex-1 font-bold text-gray-900 text-xl">
            {props.children}
        </h2>
    );
}
