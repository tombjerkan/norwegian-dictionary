import React from "react";
import useHistory from "components/useHistory";
import Navigation from "components/Navigation";
import Search from "components/Search";
import Button from "components/Button";
import MaxWidthLimit from "components/MaxWidthLimit";
import GoogleTranslate from "./GoogleTranslate";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";
import useFetch from "./useFetch";
import styles from "./styles.module.css";

export default function SearchPageContainer() {
    const [location, push] = useHistory();
    const query = location.pathname.slice(1);

    const [googleData, googleIsLoading, googleError] = useFetch(`/api/googleTranslate/${query}`);
    const [wiktionaryData, wiktionaryIsLoading, wiktionaryError] = useFetch(`/api/wiktionary/${query}`);
    const [ordbokData, ordbokIsLoading, ordbokError] = useFetch(`/api/ordbok/${query}`);

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
            onSearch={query => {
                push(`/${query}`);
            }}
            onClickStarred={() => {
                push("/starred");
            }}
        />
    );
}

export function SearchPageView({
    googleTranslate,
    wiktionary,
    ordbok,
    onSearch,
    onClickStarred
}) {
    return (
        <div>
            <Navigation className={styles.navigation}>
                <Search onSubmit={onSearch} className={styles.search} />
                <Button onClick={onClickStarred}>Starred</Button>
            </Navigation>

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
            </Content>
        </div>
    );
}

function Content({ children }) {
    return (
        <MaxWidthLimit>
            <div className={styles.content}>
                {children}
            </div>
        </MaxWidthLimit>
    );
}
