import React, { useState } from "react";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ id, title, isLoading, error, children }) {
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(!isOpen);
    }

    return (
        <div id={id} className={styles.container}>
            <h2 className={styles.title}>{title}</h2>

            {!isLoading && error === null && (
                <React.Fragment>
                    <button
                        onClick={toggleOpen}
                        className={styles.showContentButton}
                    >
                        {isOpen ? "Hide" : "Show"}
                    </button>

                    {isOpen && <div className={styles.content}>{children}</div>}
                </React.Fragment>
            )}

            {!isLoading && error === 404 && <div>Not available</div>}
            {isLoading && <Loading />}
            {!isLoading && error !== null && error !== 404 && <div>Error</div>}
        </div>
    );
}

export default Section;
