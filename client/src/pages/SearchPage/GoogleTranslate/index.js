import React from "react";
import { Section, Header } from "../Section";

export default function GoogleTranslate({ data, isLoading, error }) {
    const isContentAvailable = !isLoading && error === null;

    return (
        <Section>
            <Header title="Google" isLoading={isLoading} error={error}>
                {isContentAvailable && data}
            </Header>
        </Section>
    );
}
