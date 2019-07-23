import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ name, title, query, render }) {
    const [data, setData] = useState(null);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        fetch(`/api/${name}/${query}`)
            .then(response => response.json())
            .then(data => setData(data));
    }, [name, query]);

    function toggleOpen() {
        setOpen(!isOpen);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>

            {data !== null ? (
                <React.Fragment>
                    <button onClick={toggleOpen}>{isOpen ? "Hide" : "Show"}</button>

                    {isOpen && <div className={styles.content}>{render(data)}</div>}
                </React.Fragment>
             ) : (
                <Loading />
             )}
        </div>
    )
}

export default Section;