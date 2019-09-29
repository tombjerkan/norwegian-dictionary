import React, { useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import MaxWidthLimit from "components/MaxWidthLimit";
import SearchBox from "components/SearchBox";
import { ReactComponent as Star } from "./star.svg";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import GoogleTranslate from "./GoogleTranslate";

export default function Results({ history, match }) {
    const [isStarred, setStarred] = useState(false);
    const [isEditingNotes, setEditingNotes] = useState(false);
    const [notes, setNotes] = useState("");

    return (
        <div>
            <nav className={styles.searchBar}>
                <MaxWidthLimit>
                    <div className={styles.searchBoxContainer}>
                        <SearchBox
                            history={history}
                            className={styles.searchBox}
                        />
                        <Star
                            onClick={() => {
                                setStarred(true);
                                setEditingNotes(true);
                            }}
                            className={classNames(
                                styles.star,
                                isStarred && styles.filled
                            )}
                        />

                        {isEditingNotes && (
                            <div className={styles.notesBubble}>
                                <textarea
                                    className={styles.notes}
                                    value={notes}
                                    placeholder="Enter notes..."
                                    onChange={event =>
                                        setNotes(event.target.value)
                                    }
                                />

                                <button
                                    className={styles.ok}
                                    onClick={() => {
                                        setEditingNotes(false);
                                        window.localStorage.setItem(
                                            match.params.query,
                                            notes
                                        );
                                    }}
                                >
                                    Ok
                                </button>
                            </div>
                        )}
                    </div>
                </MaxWidthLimit>
            </nav>

            <MaxWidthLimit>
                <div className={styles.content}>
                    <GoogleTranslate query={match.params.query} />
                    <Wiktionary query={match.params.query} />
                    <Ordbok query={match.params.query} />
                </div>
            </MaxWidthLimit>
        </div>
    );
}
