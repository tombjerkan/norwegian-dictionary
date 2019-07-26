import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        axios.get(url)
            .then(response => setData(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, [url]);

    return [data, isLoading, error];
}

function Section({ name, title, query, render }) {
    const [data, isLoading, error] = useFetch(`/api/${name}/${query}`);
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(!isOpen);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>

            {data !== null && (
                <React.Fragment>
                    <button onClick={toggleOpen} className={styles.showContentButton}>
                        {isOpen ? "Hide" : "Show"}
                    </button>

                    {isOpen && <div className={styles.content}>{render(data)}</div>}
                </React.Fragment>
             )}

            {!isLoading && error === 404 && <div>Not available</div>}
            {isLoading && <Loading />}
            {error !== null && error !== 404 && <div>Error</div>}
        </div>
    )
}

export default Section;