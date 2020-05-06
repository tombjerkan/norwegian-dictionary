import React from "react";
import Link from "components/Link";

interface Props {
    to: string;
    children: React.ReactNode;
    className?: string;
}
export default function NavigationButton(props: Props) {
    return (
        <Link to={props.to}>
            <button className="flex items-center bg-white h-10 rounded-lg shadow pl-3 pr-3">
                {props.children}
            </button>
        </Link>
    );
}
