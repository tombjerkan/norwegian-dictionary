import React from "react";
import useData from "../../utils/useData";
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
    const [data, isLoading, isUnavailable, isError] = useData<string>(
        `/googleTranslate/${props.query}`
    );

    return (
        <GoogleTranslateView
            data={data}
            isLoading={isLoading}
            isUnavailable={isUnavailable}
            isError={isError}
        />
    );
}

interface ViewProps {
    data: string | null;
    isLoading: boolean;
    isUnavailable: boolean;
    isError: boolean;
}

export function GoogleTranslateView(props: ViewProps) {
    return (
        <Card isDisabled={props.isUnavailable || props.isError}>
            <Header>
                <Title>Google</Title>

                {props.isLoading && <Loading />}
                {props.isUnavailable && <NotAvailable />}
                {props.isError && <Error />}
                {!props.isLoading && !props.isUnavailable && !props.isError && (
                    <span className="text-gray-700">{props.data}</span>
                )}
            </Header>
        </Card>
    );
}
