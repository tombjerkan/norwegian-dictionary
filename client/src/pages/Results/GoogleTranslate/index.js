import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";

function GoogleTranslate({ query }) {
    const [data, isLoading, error] = useFetch(`/api/googleTranslate/${query}`);

    return (
        <Section
            title="Google Translate"
            isLoading={isLoading}
            error={error}
            data-testid="google-translate"
        >
            {data}
        </Section>
    );
}

export default GoogleTranslate;
