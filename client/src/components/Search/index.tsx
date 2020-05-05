import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Clear } from "./Clear.svg";
import styles from "./styles.module.css";

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
            className={classNames(styles.container, props.className)}
        >
            <Magnifier className={styles.magnifier} />

            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={handleChange}
                ref={inputRef}
                className={styles.input}
            />

            <Clear className={styles.clear} onClick={handleClear} />
        </form>
    );
}
