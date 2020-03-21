import React from "react";
import useFetch from "../useFetch";
import Section from "components/Section";
import Loading from "components/Loading";
import { ReactComponent as Error } from "components/Error.svg";
import styles from "./styles.module.css";

export default function GoogleTranslateContainer({ query }) {
    const [data, isLoading, error] = useFetch(`/api/googleTranslate/${query}`);

    return (
        <GoogleTranslateView data={data} isLoading={isLoading} error={error} />
    );
}

export function GoogleTranslateView({ data, isLoading, error }) {
    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;
    const isContentAvailable = !isLoading && error === null;

    return (
        <Section
            isAvailable={isContentAvailable || isLoading}
            className={styles.section}
        >
            <h2 className={styles.title}>Google</h2>

            {isLoading && <Loading />}
            {isNotFound && <div>Not available</div>}
            {isError && <Error style={{ height: "30px" }} />}
            {isContentAvailable && data}
        </Section>
    );
}
