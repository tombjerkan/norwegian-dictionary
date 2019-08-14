import React from "react";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";

export default function Search({ history }) {
    return (
        <MaxWidthLimit>
            <div className={styles.container}>
                <SearchBox history={history} className={styles.searchBox} />
            </div>
        </MaxWidthLimit>
    );
}
