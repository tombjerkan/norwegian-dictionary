import React, { useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { ReactComponent as SearchIcon } from "./search-icon.svg";

export default function SearchBox({ history, className }) {
    const [inputValue, setInputValue] = useState("");

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleSubmit(event) {
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
                />
            </form>
        </div>
    );
}
