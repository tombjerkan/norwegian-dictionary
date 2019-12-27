import React, { useState, useEffect } from "react";
import axios from "axios";
import useHistory from "components/useHistory";
import Navigation from "components/Navigation";
import Search from "components/Search";
import Button from "components/Button";
import MaxWidthLimit from "components/MaxWidthLimit";
import GoogleTranslate from "./GoogleTranslate";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import Star from "./Star";
import useFetch from "./useFetch";
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

export default function SearchPageContainer() {
    const [location, push] = useHistory();
    const query = location.pathname.startsWith("/search/")
        ? location.pathname.slice(8)
        : "";

    const [googleData, googleIsLoading, googleError] = useFetch(
        `/api/googleTranslate/${query}`
    );
    const [wiktionaryData, wiktionaryIsLoading, wiktionaryError] = useFetch(
        `/api/wiktionary/${query}`
    );
    const [ordbokData, ordbokIsLoading, ordbokError] = useFetch(
        `/api/ordbok/${query}`
    );
    const [starredEntry, postStarredEntry] = useStarredEntry(query);

    return (
        <SearchPageView
            googleTranslate={{
                data: googleData,
                isLoading: googleIsLoading,
                error: googleError
            }}
            ordbok={{
                data: ordbokData,
                isLoading: ordbokIsLoading,
                error: ordbokError
            }}
            wiktionary={{
                data: wiktionaryData,
                isLoading: wiktionaryIsLoading,
                error: wiktionaryError
            }}
            starredEntry={starredEntry}
            postStarredEntry={notes => postStarredEntry(query, notes)}
            onSearch={query => {
                push(`/search/${query}`);
            }}
            onClickStarred={() => {
                push("/starred");
            }}
            isQuerySet={query !== ""}
        />
    );
}

export function SearchPageView({
    googleTranslate,
    wiktionary,
    ordbok,
    starredEntry,
    postStarredEntry,
    onSearch,
    onClickStarred,
    query,
    isQuerySet
}) {
    return (
        <div>
            <Navigation className={styles.navigation}>
                <Search onSubmit={onSearch} className={styles.search} />
                <Button onClick={onClickStarred}>Starred</Button>
            </Navigation>

            {isQuerySet && (
                <Content>
                    <GoogleTranslate
                        data={googleTranslate.data}
                        isLoading={googleTranslate.isLoading}
                        error={googleTranslate.error}
                    />

                    <Wiktionary
                        data={wiktionary.data}
                        isLoading={wiktionary.isLoading}
                        error={wiktionary.error}
                    />

                    <Ordbok
                        data={ordbok.data}
                        isLoading={ordbok.isLoading}
                        error={ordbok.error}
                    />

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
