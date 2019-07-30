import React, { useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ id, title, isLoading, error, children }) {
    const [isOpen, setOpen] = useState(false);

    const isContentAvailable = !isLoading && error === null;
    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;

    function toggleOpen() {
        // Don't want to change isOpen state before there is content to show
        if (!isContentAvailable) {
            return;
        }

        setOpen(!isOpen);
    }

    return (
        <div
            id={id}
            className={classNames(
                styles.container,
                (isNotFound || isError) && styles.unavailable
            )}
        >
            <header className={styles.header} onClick={toggleOpen}>
                <h2 className={styles.title}>{title}</h2>

                {isContentAvailable && <div>{isOpen ? "Hide" : "Show"}</div>}
                {isNotFound && <div>Not found</div>}
                {isLoading && <Loading />}
                {isError && <div>Error</div>}
            </header>

            {isContentAvailable && isOpen && (
                <div className={styles.content}>{children}</div>
            )}
        </div>
    );
}

export default Section;
