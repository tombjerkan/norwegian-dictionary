import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import Entries from "./Entries";

export default function Wiktionary({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`, []);

    return (
        <Section
            title="Wiktionary"
            isLoading={isLoading}
            error={error}
            data-testid="wiktionary"
        >
            <Entries entries={data} />
        </Section>
    );
}
