import React from "react";
import Section from "src/pages/Results/Section";
import useFetch from "src/pages/Results/useFetch";

function Wiktionary({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`);

    return (
        <Section title="Wiktionary" isLoading={isLoading} error={error}>
            <div dangerouslySetInnerHTML={{ __html: data }} />
        </Section>
    );
}

export default Wiktionary;
