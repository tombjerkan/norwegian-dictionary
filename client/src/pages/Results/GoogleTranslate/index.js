import React from "react";
import Section from "src/pages/Results/Section";
import useFetch from "src/pages/Results/useFetch";

function GoogleTranslate({ query }) {
    const [data, isLoading, error] = useFetch(`/api/googleTranslate/${query}`);

    return (
        <Section title="Google Translate" isLoading={isLoading} error={error}>
            {data}
        </Section>
    );
}

export default GoogleTranslate;
