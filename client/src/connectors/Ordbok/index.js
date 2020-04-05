import React, { useState } from "react";
import Section from "components/Section";
import OrdbokContent from "components/OrdbokContent";
import ExpandChevron from "components/ExpandChevron";
import Loading from "components/Loading";
import { ReactComponent as Error } from "components/Error.svg";
import CloseButton from "components/CloseButton";
import useFetch from "../useFetch";
import styles from "./styles.module.css";

export default function OrdbokContainer({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`);

    return (
        <OrdbokView
            data={data}
            isLoading={isLoading}
            error={error}
            key={query}
        />
    );
}

export function OrdbokView({ data, isLoading, error }) {
    const [isOpen, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(prev => !prev);
    }

    function close() {
        setOpen(false);
    }

    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;
    const isContentAvailable = !isLoading && error === null;

    return (
        <Section isAvailable={isContentAvailable || isLoading}>
            <div onClick={toggleOpen} className={styles.header}>
                <h2 className={styles.title}>Ordbok</h2>

                {isLoading && <Loading />}
                {isNotFound && <div>Not available</div>}
                {isError && <Error style={{ height: "30px" }} />}
                {isContentAvailable && <ExpandChevron isOpen={isOpen} />}
            </div>

            {isContentAvailable && isOpen && (
                <>
                    <div className={styles.expandableContent}>
                        {data && <OrdbokContent data={data} />}
                    </div>

                    <CloseButton onClose={close} />
                </>
            )}
        </Section>
    );
}
