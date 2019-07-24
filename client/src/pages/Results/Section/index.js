import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ name, title, query, render }) {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch(`/api/${name}/${query}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 404) {
                    return null;
                } else {
                    setError(true);
                    return null;
                }
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setError(true));
    }, [name, query]);

    function toggleOpen() {
        setOpen(!isOpen);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>

            {data !== null && (
                <React.Fragment>
                    <button onClick={toggleOpen}>{isOpen ? "Hide" : "Show"}</button>

                    {isOpen && <div className={styles.content}>{render(data)}</div>}
                </React.Fragment>
             )}

            {data === null && !isLoading && !isError && <div>Not available</div>}
            {isLoading && <Loading />}
            {isError && <div>Error</div>}
        </div>
    )
}

export default Section;