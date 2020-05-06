import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function MaxWidthLimit(props: Props) {
    return (
        <div className="max-w-xl ml-auto mr-auto pl-3 pr-3">
            {props.children}
        </div>
    );
}
