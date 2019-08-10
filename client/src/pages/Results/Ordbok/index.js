import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import Entries from "./Entries";

export default function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`, []);

    return (
        <Section
            title="Ordbok"
            isLoading={isLoading}
            error={error}
            data-testid="ordbok"
        >
            <Entries entries={data} />
        </Section>
    );
}
