import React, { useState } from "react";
import classNames from "classnames";
import {
    Card,
    Error,
    ExpandArrow,
    Header,
    Loading,
    NotAvailable,
    Title
} from "components/Section";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import useFetch from "../../utils/useFetch";
import Content from "./Content";

interface Props {
    query: string;
}

export default function WiktionaryContainer(props: Props) {
    const [data, isLoading, error] = useFetch<string>(
        `/api/wiktionary/${props.query}`,
        null
    );

    return (
        <WiktionaryView
            data={data}
            isLoading={isLoading}
            error={error}
            key={props.query}
        />
    );
}

interface ViewProps {
    data: string | null;
    isLoading: boolean;
    error: number | null;
}

export function WiktionaryView(props: ViewProps) {
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(prev => !prev);
    }

    function close() {
        setOpen(false);
    }

    const isNotFound = !props.isLoading && props.error === 404;
    const isError =
        !props.isLoading && props.error !== null && props.error !== 404;
    const isContentAvailable = !props.isLoading && props.error === null;

    return (
        <Card isDisabled={isNotFound || isError}>
            <Header onClick={toggleOpen} className="cursor-pointer">
                <Title>Wiktionary</Title>
                {props.isLoading && <Loading />}
                {isNotFound && <NotAvailable />}
                {isError && <Error />}
                {isContentAvailable && <ExpandArrow isOpen={isOpen} />}
            </Header>

            {isContentAvailable && isOpen && (
                <>
                    <div className="pt-6 pl-4 pr-4 pb-16 border-t border-gray-200">
                        {props.data !== null && <Content data={props.data} />}
                    </div>
                    <button
                        onClick={close}
                        className="flex justify-center items-center w-full h-10 bg-gray-100"
                    >
                        <Chevron className="w-3 transform rotate-180" />
                    </button>
                </>
            )}
        </Card>
    );
}
