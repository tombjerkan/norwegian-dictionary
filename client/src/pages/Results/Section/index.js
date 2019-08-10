import React, { useState } from "react";
import classNames from "classnames";
import { Collapse } from "react-collapse";
import styles from "./styles.module.css";
import Loading from "pages/Results/Section/Loading";
import { ReactComponent as Error } from "components/Error.svg";

export default function Section({
    title,
    isLoading,
    error,
    children,
    "data-testid": dataTestId
}) {
    const [isOpen, setOpen] = useState(false);

    const isContentAvailable = !isLoading && error === null;
    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;

    function toggleOpen() {
        // Don't want to change isOpen state before there is content to show
        if (!isContentAvailable) {
            return;
        }

        setOpen(!isOpen);
    }

    return (
        <section
            className={classNames(
                styles.container,
                (isNotFound || isError) && styles.unavailable
            )}
            data-testid={dataTestId}
        >
            <header className={styles.header} onClick={toggleOpen}>
                <h2 className={styles.title}>{title}</h2>

                {isContentAvailable && <div>{isOpen ? "Hide" : "Show"}</div>}
                {isNotFound && <div>Not found</div>}
                {isLoading && <Loading />}
                {isError && <Error className={styles.error} />}
            </header>

            {isContentAvailable && (
                <Collapse isOpened={isOpen}>
                    <article className={styles.content}>{children}</article>
                </Collapse>
            )}
        </section>
    );
}
