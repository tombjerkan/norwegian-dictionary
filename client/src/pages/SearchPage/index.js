import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "routing";
import Navigation from "components/Navigation";
import Search from "components/Search";
import StarredNavigationButton from "./StarredNavigationButton";
import MaxWidthLimit from "components/MaxWidthLimit";
import GoogleTranslate from "./GoogleTranslate";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import Star from "./Star";
import styles from "./styles.module.css";

function useStarredEntry(term) {
    const [entry, setEntry] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setEntry(null);
        setLoading(true);
        setError(null);

        axios
            .get(`/api/starred/${term}`)
            .then(response => setEntry(response.data))
            .catch(error => setError(error.response.status))
            .finally(() => setLoading(false));
    }, [term]);

    function postEntry(term, notes) {
        setEntry({ term, notes });
        axios.post("/api/starred", { term, notes });
    }

    return [entry, postEntry, isLoading, error];
}

export default function SearchPageContainer({ query }) {
    const [starredEntry, postStarredEntry] = useStarredEntry(query);

    return (
        <SearchPageView
            starredEntry={starredEntry}
            postStarredEntry={notes => postStarredEntry(query, notes)}
            query={query}
        />
    );
}

export function SearchPageView({
    starredEntry,
    postStarredEntry,
    onSearch,
    query
}) {
    function handleSearch(query) {
        history.push(`/search/${query}`);
    }

    return (
        <div>
            <Navigation className={styles.navigation}>
                <Search onSubmit={handleSearch} initialValue={query} className={styles.search} />
                <StarredNavigationButton />
            </Navigation>

            {query && (
                <Content>
                    <GoogleTranslate query={query} />
                    <Wiktionary query={query} />
                    <Ordbok query={query} />

                    <Star entry={starredEntry} postEntry={postStarredEntry} />
                </Content>
            )}
        </div>
    );
}

function Content({ children }) {
    return (
        <MaxWidthLimit>
            <div className={styles.content}>{children}</div>
        </MaxWidthLimit>
    );
}
