import React from "react";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";

export default function Results({ history, match }) {
    return (
        <div>
            <nav className={styles.searchBar}>
                <MaxWidthLimit>
                    <SearchBox history={history} className={styles.searchBox} />
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <Ordbok query={match.params.query} />
                    <Wiktionary query={match.params.query} />
                    <GoogleTranslate query={match.params.query} />
                </div>
            </MaxWidthLimit>
        </div>
    );
}
