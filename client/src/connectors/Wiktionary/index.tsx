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
import useData from "../../utils/useData";
import Content from "./Content";
import classNames from "classnames";

interface Props {
    query: string;
}

export default function WiktionaryContainer(props: Props) {
    const [data, isLoading, isUnavailable, isError] = useData<string>(
        `/wiktionary/?word=${props.query}`,
        null
    );

    return (
        <WiktionaryView
            data={data}
            isLoading={isLoading}
            isUnavailable={isUnavailable}
            isError={isError}
            key={props.query}
        />
    );
}

interface ViewProps {
    data: string | null;
    isLoading: boolean;
    isUnavailable: boolean;
    isError: boolean;
}

export function WiktionaryView(props: ViewProps) {
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(prev => !prev);
    }

    function close() {
        setOpen(false);
    }

    const isContentAvailable =
        !props.isLoading && !props.isUnavailable && !props.isError;

    return (
        <Card isDisabled={props.isUnavailable || props.isError}>
            <Header
                onClick={toggleOpen}
                className={classNames(!props.isUnavailable && "cursor-pointer")}
            >
                <Title>Wiktionary</Title>
                {props.isLoading && <Loading />}
                {props.isUnavailable && <NotAvailable />}
                {props.isError && <Error />}
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
