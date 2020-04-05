import React, { useState } from "react";
import Section from "components/Section";
import Loading from "components/Loading";
import ExpandChevron from "components/ExpandChevron";
import { ReactComponent as Error } from "components/Error.svg";
import CloseButton from "components/CloseButton";
import useFetch from "../../utils/useFetch";
import WiktionaryContent from "components/WiktionaryContent";
import styles from "./styles.module.css";

export default function WiktionaryContainer({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`);

    return (
        <WiktionaryView
            data={data}
            isLoading={isLoading}
            error={error}
            key={query}
        />
    );
}

export function WiktionaryView({ data, isLoading, error }) {
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
                <h2 className={styles.title}>Wiktionary</h2>

                {isLoading && <Loading />}
                {isNotFound && <div>Not available</div>}
                {isError && <Error style={{ height: "30px" }} />}
                {isContentAvailable && <ExpandChevron isOpen={isOpen} />}
            </div>

            {isContentAvailable && isOpen && (
                <>
                    <div className={styles.expandableContent}>
                        {data && <WiktionaryContent data={data} />}
                    </div>

                    <CloseButton onClose={close} />
                </>
            )}
        </Section>
    );
}
