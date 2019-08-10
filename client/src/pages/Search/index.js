import React from "react";
import styles from "./styles.module.css";
import SearchBox from "components/SearchBox";

export default function Search({ history }) {
    return (
        <div className={styles.container}>
            <SearchBox history={history} />
        </div>
    );
}
