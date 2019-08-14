import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import Entry from "pages/Results/Entry";
import Senses from "pages/Results/Ordbok/Senses";

export default function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`, []);

    return (
        <Section
            title="Ordbok"
            isLoading={isLoading}
            error={error}
            data-testid="ordbok"
        >
            {data.map(entry => (
                <Entry header={entry.term} etymology={entry.etymology}>
                    <Senses senses={entry.senses} />
                </Entry>
            ))}
        </Section>
    );
}
