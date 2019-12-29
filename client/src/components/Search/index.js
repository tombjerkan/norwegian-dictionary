import React, { useState, useRef } from "react";
import classNames from "classnames";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Clear } from "./Clear.svg";
import styles from "./styles.module.css";

export default function Search({ initialValue, onSubmit, className }) {
    const [value, setValue] = useState(initialValue || "");
    const inputRef = useRef(null);

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleClear() {
        setValue("");
    }

    function handleSubmit(event) {
        // Input does not automatically unfocus as same root page is used,
        // must unfocus manually for mobile keyboard to disappear.
        inputRef.current.blur();

        onSubmit(value);
        event.preventDefault();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={classNames(styles.container, className)}
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
