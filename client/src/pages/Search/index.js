import React from "react";
import styles from "./styles.module.css";
import Page from "components/Page";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";

export default function Search({ history }) {
    return (
        <Page className={styles.container}>
            <MaxWidthLimit>
                <SearchBox history={history} className={styles.searchBox} />
            </MaxWidthLimit>
        </Page>
    );
}
