import React, { useState } from "react";
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
import { Entry } from "./types";

interface Props {
    query: string;
}

export default function OrdbokContainer(props: Props) {
    const [data, isLoading, error] = useFetch<Entry[]>(
        `/api/ordbok/${props.query}`
    );

    return (
        <OrdbokView
            data={data}
            isLoading={isLoading}
            error={error}
            key={props.query}
        />
    );
}

interface ViewProps {
    data: Entry[] | null;
    isLoading: boolean;
    error: number | null;
}

export function OrdbokView(props: ViewProps) {
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
                <Title>Ordbok</Title>

                {props.isLoading && <Loading />}
                {isNotFound && <NotAvailable />}
                {isError && <Error />}
                {isContentAvailable && <ExpandArrow isOpen={isOpen} />}
            </Header>

            {isContentAvailable && isOpen && (
                <>
                    <div className="pt-6 pl-4 pr-4 pb-16 border-t border-gray-200">
                        {props.data && <Content data={props.data!} />}
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
