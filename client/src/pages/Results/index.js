import React from "react";
import styles from "./styles.module.css";
import SearchBox from "components/SearchBox";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";

export default function Results({ history, match }) {
    return (
        <div className={styles.container}>
            <nav className={styles.searchBar}>
                <SearchBox history={history} className={styles.searchBox} />
            </nav>

            <div className={styles.content}>
                <Ordbok query={match.params.query} />
                <Wiktionary query={match.params.query} />
                <GoogleTranslate query={match.params.query} />
            </div>
        </div>
    );
}
