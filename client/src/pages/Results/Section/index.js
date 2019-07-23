import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Loading from "components/Loading";

function Section({ name, title, query, render }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`/api/${name}/${query}`)
            .then(response => response.json())
            .then(data => setData(data));
    }, [name, query]);

    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            {data !== null ? render(data) : <Loading />}
        </div>
    )
}

export default Section;