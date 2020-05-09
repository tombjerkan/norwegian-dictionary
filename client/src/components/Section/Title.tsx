import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function Title(props: Props) {
    return <h2 className="flex-1 text-gray-900 text-xl">{props.children}</h2>;
}
