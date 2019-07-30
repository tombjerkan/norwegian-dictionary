import React, { useState } from "react";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ id, title, isLoading, error, children }) {
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        // Don't want to change isOpen state before there is content to show
        if (isLoading || error) {
            return;
        }

        setOpen(!isOpen);
    }

    return (
        <div id={id} className={styles.container}>
            <header className={styles.header} onClick={toggleOpen}>
                <h2 className={styles.title}>{title}</h2>

                {!isLoading && error === null && (
                    <div>{isOpen ? "Hide" : "Show"}</div>
                )}
                {!isLoading && error === 404 && <div>Not available</div>}
                {isLoading && <Loading />}
                {!isLoading && error !== null && error !== 404 && (
                    <div>Error</div>
                )}
            </header>

            {!isLoading && error === null && isOpen && (
                <div className={styles.content}>{children}</div>
            )}
        </div>
    );
}

export default Section;
