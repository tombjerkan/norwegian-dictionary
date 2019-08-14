import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import Entry from "pages/Results/Entry";
import SubEntry from "./SubEntry";
import WordList from "./WordList";

export default function Wiktionary({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`, []);

    return (
        <Section
            title="Wiktionary"
            isLoading={isLoading}
            error={error}
            data-testid="wiktionary"
        >
            {data.map((entry, index) => (
                <Entry
                    header={`Etymology ${index + 1}`}
                    etymology={entry.etymology}
                >
                    {entry.subEntries.map(subEntry => (
                        <SubEntry subEntry={subEntry} />
                    ))}

                    {entry.synonyms.length > 0 && (
                        <WordList title="Synonyms" words={entry.synonyms} />
                    )}
                    {entry.derived.length > 0 && (
                        <WordList title="Derived terms" words={entry.derived} />
                    )}
                </Entry>
            ))}
        </Section>
    );
}
