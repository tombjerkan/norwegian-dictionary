import React from "react";
import { history } from "routing";

interface Props {
    to: string;
    children: React.ReactNode;
}

export default function Link(props: Props) {
    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        history.push(props.to);
    }

    return (
        <a href={props.to} onClick={handleClick} className="text-blue-500">
            {props.children}
        </a>
    );
}
