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
import { Entry } from "./types";
import classNames from "classnames";

interface Props {
    query: string;
}

interface ApiResponse {
    content: Entry[];
}

export default function OrdbokContainer(props: Props) {
    const [data, isLoading, isUnavailable, isError] = useData<ApiResponse>(
        `/ordbok/?word=${props.query}`,
    );

    return (
        <OrdbokView
            data={data?.content ?? null}
            isLoading={isLoading}
            isUnavailable={isUnavailable}
            isError={isError}
            key={props.query}
        />
    );
}

interface ViewProps {
    data: Entry[] | null;
    isLoading: boolean;
    isUnavailable: boolean;
    isError: boolean;
}

export function OrdbokView(props: ViewProps) {
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
                <Title>Ordbok</Title>

                {props.isLoading && <Loading />}
                {props.isUnavailable && <NotAvailable />}
                {props.isError && <Error />}
                {isContentAvailable && <ExpandArrow isOpen={isOpen} />}
            </Header>

            {isContentAvailable && isOpen && (
                <>
                    <div className="pt-6 pl-4 pr-4 pb-16 border-t border-gray-200">
                        {props.data && <Content data={props.data!} />}
                    </div>

                    <button
                        onClick={close}
                        className="flex justify-center items-center w-full h-10 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    >
                        <Chevron className="w-3 transform rotate-180" />
                    </button>
                </>
            )}
        </Card>
    );
}
