import React, { useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { ReactComponent as SearchIcon } from "./search-icon.svg";

function SearchBox({ history, className }) {
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
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className={styles.queryInput}
                />
                <button type="submit" className={styles.submitButton}>
                    <SearchIcon className={styles.searchIcon} />
                </button>
            </form>
        </div>
    );
}

export default SearchBox;
