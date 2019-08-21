import React from "react";
import styles from "./styles.module.css";
import Page from "components/Page";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";

export default function Results({ history, match }) {
    return (
        <Page>
            <nav className={styles.searchBar}>
                <MaxWidthLimit>
                    <SearchBox
                        onSubmit={value => history.push(`/${value}`)}
                        className={styles.searchBox}
                    />
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <GoogleTranslate query={match.params.query} />
                    <Wiktionary query={match.params.query} />
                    <Ordbok query={match.params.query} />
                </div>
            </MaxWidthLimit>
        </Page>
    );
}
