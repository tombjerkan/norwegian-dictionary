import React from "react";
import useFetch from "../useFetch";
import { Section, Header } from "../Section";

export default function GoogleTranslateContainer({ query }) {
    const [data, isLoading, error] = useFetch(`/api/googleTranslate/${query}`);

    return (
        <GoogleTranslateView data={data} isLoading={isLoading} error={error} />
    );
}

export function GoogleTranslateView({ data, isLoading, error }) {
    const isContentAvailable = !isLoading && error === null;

    return (
        <Section>
            <Header title="Google" isLoading={isLoading} error={error}>
                {isContentAvailable && data}
            </Header>
        </Section>
    );
}
