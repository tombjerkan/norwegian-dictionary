import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "routing";
import Navigation from "components/Navigation";
import Search from "components/Search";
import StarredNavigationButton from "./StarredNavigationButton";
import MaxWidthLimit from "components/MaxWidthLimit";
import GoogleTranslate from "../GoogleTranslate";
import Ordbok from "../Ordbok";
import Wiktionary from "../Wiktionary";
import Star from "./Star";
import { Entry } from "./types";

function useStarredEntry(term: string): [Entry | null, (entry: Entry) => void] {
    const [entry, setEntry] = useState<Entry | null>(null);

    useEffect(() => {
        setEntry(null);

        axios
            .get(`/api/starred/${term}`)
            .then(response => setEntry(response.data))
            .catch(() => {});
    }, [term]);

    function postEntry(entry: Entry) {
        setEntry(entry);
        axios.post("/api/starred", entry);
    }

    return [entry, postEntry];
}

interface Props {
    query: string;
}

export default function SearchPageContainer(props: Props) {
    const [starredEntry, postStarredEntry] = useStarredEntry(props.query);

    return (
        <SearchPageView
            starredEntry={starredEntry}
            postStarredEntry={(notes: string) =>
                postStarredEntry({ term: props.query, notes })
            }
            query={props.query}
        />
    );
}

interface ViewProps {
    starredEntry: Entry | null;
    postStarredEntry(notes: string): void;
    query: string;
}

export function SearchPageView(props: ViewProps) {
    function handleSearch(query: string) {
        history.push(`/search/${query}`);
    }

    return (
        <div className="min-h-screen bg-gray-200">
            <Navigation className="mb-8">
                <Search
                    onSubmit={handleSearch}
                    initialValue={props.query}
                    className="flex-1 mr-3"
                />
                <StarredNavigationButton />
            </Navigation>

            {props.query && (
                <>
                    <Content>
                        <GoogleTranslate query={props.query} />
                        <Wiktionary query={props.query} />
                        <Ordbok query={props.query} />
                    </Content>

                    <Star
                        entry={props.starredEntry}
                        postEntry={props.postStarredEntry}
                    />
                </>
            )}
        </div>
    );
}

interface ContentProps {
    children: React.ReactNode;
}

function Content(props: ContentProps) {
    return (
        <MaxWidthLimit>
            <div className="pb-8 space-y-8">{props.children}</div>
        </MaxWidthLimit>
    );
}
