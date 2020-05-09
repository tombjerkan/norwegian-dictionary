import React from "react";
import useFetch from "../../utils/useFetch";
import {
    Card,
    Error,
    Header,
    Loading,
    NotAvailable,
    Title
} from "components/Section";

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
        <Card isDisabled={isNotFound || isError}>
            <Header>
                <Title>Google</Title>

                {props.isLoading && <Loading />}
                {isNotFound && <NotAvailable />}
                {isError && <Error />}
                {isContentAvailable && (
                    <span className="text-gray-700">{props.data}</span>
                )}
            </Header>
        </Card>
    );
}
