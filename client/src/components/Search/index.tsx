import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";

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
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                <Magnifier className="stroke-current text-gray-600 w-4 h-4" />
            </div>

            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={handleChange}
                ref={inputRef}
                className="bg-white shadow-md outline-none border border-transparent placeholder-gray-600 rounded-lg py-2 pr-4 pl-10 block w-full appearance-none leading-normal "
            />
        </form>
    );
}
