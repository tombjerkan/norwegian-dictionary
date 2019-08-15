import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";

export default function GoogleTranslate({ query }) {
    const [data, isLoading, error] = useFetch(`/api/googleTranslate/${query}`);

    return (
        <Section
            title="Google"
            isInline={true}
            isLoading={isLoading}
            error={error}
            data-testid="google-translate"
        >
            {data}
        </Section>
    );
}
