import React from "react";
import styles from "./styles.module.css";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";

function Results({ match }) {
    return (
        <div className={styles.container}>
            <Ordbok query={match.params.query} />
            <Wiktionary query={match.params.query} />
            <GoogleTranslate query={match.params.query} />
        </div>
    );
}

export default Results;
