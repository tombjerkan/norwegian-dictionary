import React, { useState, useRef } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { ReactComponent as SearchIcon } from "./search-icon.svg";

export default function SearchBox({ history, className }) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleSubmit(event) {
        // Need to manually unfocus input so that keyboard hides on mobile
        inputRef.current.blur();

        history.push(`/${inputValue}`);
        event.preventDefault();
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className={classNames(styles.form, className)}
            >
                <SearchIcon className={styles.icon} />

                <input
                    type="text"
                    placeholder="Search..."
                    value={inputValue}
                    onChange={handleChange}
                    className={styles.queryInput}
                    ref={inputRef}
                />
            </form>
        </div>
    );
}
