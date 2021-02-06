import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "routing";
import Navigation from "components/Navigation";
import Search from "components/Search";
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
            .get(`/starredTerms/${term}/`)
            .then(response => setEntry(response.data))
            .catch(() => {});
    }, [term]);

    function postEntry(newEntry: Entry) {
        if (entry === null) {
            axios.post("/starredTerms/", newEntry);
        } else {
            axios.put(`/starredTerms/${newEntry.term}/`, newEntry);
        }
        setEntry(newEntry);
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

    function navigate(event: React.MouseEvent) {
        event.preventDefault();
        history.push("/starred");
    }

    return (
        <>
            <Navigation className="mb-8">
                <Search
                    onSubmit={handleSearch}
                    initialValue={props.query}
                    className="flex-1 mr-3"
                />

                <a
                    href="/starred"
                    onClick={navigate}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 "
                >
                    Starred →
                </a>
            </Navigation>

            {props.query && (
                <>
                    <div className="max-width-limit pb-8 space-y-8">
                        <GoogleTranslate query={props.query} />
                        <Wiktionary query={props.query} />
                        <Ordbok query={props.query} />
                    </div>

                    <Star
                        entry={props.starredEntry}
                        postEntry={props.postStarredEntry}
                    />
                </>
            )}
        </>
    );
}
