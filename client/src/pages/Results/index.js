import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";
import Star from "./Star";

export default function Results({ history, match }) {
    return (
        <div>
            <nav className={styles.navigationBar}>
                <MaxWidthLimit>
                    <div className={styles.tabs}>
                        <div
                            className={classNames(styles.tab, styles.activeTab)}
                        >
                            Search
                        </div>
                        <Link to="/starred" className={styles.tab}>
                            Starred
                        </Link>
                    </div>

                    <SearchBox history={history} className={styles.searchBox} />
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <GoogleTranslate query={match.params.query} />
                    <Wiktionary query={match.params.query} />
                    <Ordbok query={match.params.query} />
                </div>

                <Star query={match.params.query} />
            </MaxWidthLimit>
        </div>
    );
}
