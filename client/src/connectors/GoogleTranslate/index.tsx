import React from "react";
import useFetch from "../../utils/useFetch";
import Section from "components/Section";
import Loading from "components/Loading";
import { ReactComponent as Error } from "components/Error.svg";
import styles from "./styles.module.css";

interface Props {
    query: string;
}

export default function GoogleTranslateContainer(props: Props) {
    const [data, isLoading, error] = useFetch<string>(
        `/api/googleTranslate/${props.query}`
    );

    return (
        <GoogleTranslateView data={data} isLoading={isLoading} error={error} />
    );
}

interface ViewProps {
    data: string | null;
    isLoading: boolean;
    error: number | null;
}

export function GoogleTranslateView(props: ViewProps) {
    const isNotFound = !props.isLoading && props.error === 404;
    const isError =
        !props.isLoading && props.error !== null && props.error !== 404;
    const isContentAvailable = !props.isLoading && props.error === null;

    return (
        <Section
            isAvailable={isContentAvailable || props.isLoading}
            className={styles.section}
        >
            <h2 className={styles.title}>Google</h2>

            {props.isLoading && <Loading />}
            {isNotFound && <div>Not available</div>}
            {isError && <Error style={{ height: "30px" }} />}
            {isContentAvailable && props.data}
        </Section>
    );
}
