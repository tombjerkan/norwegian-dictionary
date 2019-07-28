import React, { useState } from "react";
import styles from "./styles.module.css";

function Search({ history }) {
    const [inputValue, setInputValue] = useState("");

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    function handleSubmit(event) {
        history.push(`/${inputValue}`);
        event.preventDefault();
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    className={styles.queryInput}
                />
                <input
                    type="submit"
                    value="Submit"
                    className={styles.submitButton}
                />
            </form>
        </div>
    );
}

export default Search;
