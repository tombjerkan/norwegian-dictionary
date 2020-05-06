import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Clear } from "./Clear.svg";

interface Props {
    initialValue?: string;
    className?: string;
    onSubmit(value: string): void;
}

export default function Search(props: Props) {
    const [value, setValue] = useState(props.initialValue ?? "");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.initialValue !== undefined) {
            setValue(props.initialValue);
        }
    }, [props.initialValue]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    function handleClear() {
        setValue("");
    }

    function handleSubmit(event: React.FormEvent) {
        // Input does not automatically unfocus as same root page is used,
        // must unfocus manually for mobile keyboard to disappear.
        inputRef?.current?.blur();

        props.onSubmit(value);
        event.preventDefault();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={classNames("relative", props.className)}
        >
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                <Magnifier className="h-4 stroke-current" />
            </div>

            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={handleChange}
                ref={inputRef}
                className="h-10 rounded-lg pl-10 pr-12 shadow w-full"
            />

            <button className="absolute inset-y-0 right-0 pl-4 pr-4 flex items-center">
                <Clear className="h-4" onClick={handleClear} />
            </button>
        </form>
    );
}
