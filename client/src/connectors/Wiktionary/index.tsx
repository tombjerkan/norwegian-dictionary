import React, { useState } from "react";
import Section from "components/Section";
import Loading from "components/Loading";
import ExpandChevron from "components/ExpandChevron";
import { ReactComponent as Error } from "components/Error.svg";
import CloseButton from "components/CloseButton";
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
        <Section isAvailable={isContentAvailable || props.isLoading}>
            <div
                onClick={toggleOpen}
                className="flex items-center px-4 py-4 cursor-pointer"
            >
                <h2 className="flex-1 text-gray-900 text-xl">Wiktionary</h2>

                {props.isLoading && <Loading />}
                {isNotFound && <div>Not available</div>}
                {isError && <Error className="h-8" />}
                {isContentAvailable && <ExpandChevron isOpen={isOpen} />}
            </div>

            {isContentAvailable && isOpen && (
                <>
                    <div className="pt-6 pl-4 pr-4 pb-16 border-t border-gray-200">
                        {props.data !== null && <Content data={props.data} />}
                    </div>

                    <CloseButton onClose={close} />
                </>
            )}
        </Section>
    );
}
