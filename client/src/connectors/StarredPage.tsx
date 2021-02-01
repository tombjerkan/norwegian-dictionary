import React, { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "components/Navigation";
import { Entry } from "./SearchPage/types";
import { history } from "routing";
import Search from "components/Search";

export default function StarredPageContainer() {
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        axios
            .get("/starred")
            .then(response => setEntries(response.data))
            .catch(() => {});
    }, []);

    function deleteEntry(term: string) {
        setEntries(entries.filter(v => v.term !== term));
        axios.delete(`/starred/${term}/`);
    }

    return <StarredPageView entries={entries} onDelete={deleteEntry} />;
}

interface Props {
    entries: Entry[];
    onDelete(term: string): void;
}

export function StarredPageView(props: Props) {
    function handleSearch(query: string) {
        history.push(`/search/${query}`);
    }

    return (
        <>
            <Navigation>
                <Search onSubmit={handleSearch} className="w-full" />
            </Navigation>

            <div className="max-width-limit">
                <div className="rounded-lg bg-white shadow mt-8">
                    <h2 className="text-bold text-black py-6 px-4">Starred</h2>
                    <ul>
                        {props.entries.map(entry => (
                            <StarredEntry
                                term={entry.term}
                                notes={entry.notes}
                                onDelete={() => props.onDelete(entry.term)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

interface StarredEntryProps {
    term: string;
    notes: string;
    onDelete(): void;
}

function StarredEntry(props: StarredEntryProps) {
    function navigate(event: React.MouseEvent) {
        event.preventDefault();
        history.push(`/search/${props.term}`);
    }

    return (
        <li className="flex flex-wrap p-6 border-t">
            <h3 className="flex-1">
                <a
                    href={`/search/${props.term}`}
                    onClick={navigate}
                    className="text-blue-500"
                >
                    {props.term}
                </a>
            </h3>

            <button onClick={props.onDelete}>Remove</button>

            <p className="w-full text-gray-800">{props.notes}</p>
        </li>
    );
}
