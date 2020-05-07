import React from "react";
import useFetch from "../../utils/useFetch";
import Section from "components/Section";
import Loading from "components/Loading";
import { ReactComponent as Error } from "components/Error.svg";

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
            className="flex items-center px-4 py-4"
        >
            <h2 className="flex-1 text-gray-900 text-xl">Google</h2>

            {props.isLoading && <Loading />}
            {isNotFound && <div>Not available</div>}
            {isError && <Error className="h-8" />}
            {isContentAvailable && (
                <span className="text-gray-700">{props.data}</span>
            )}
        </Section>
    );
}
