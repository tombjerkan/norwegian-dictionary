import React, { useState } from "react";
import classNames from "classnames";
import { Collapse } from "react-collapse";
import styles from "./styles.module.css";
import Loading from "components/Loading";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import { ReactComponent as Error } from "components/Error.svg";

export default function Section({
    title,
    isLoading,
    error,
    children,
    isInline,
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

        if (isInline) {
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
            <header
                className={classNames(
                    styles.header,
                    isContentAvailable && !isInline && styles.clickableHeader
                )}
                onClick={toggleOpen}
            >
                <h2 className={styles.title}>{title}</h2>

                {isContentAvailable && !isInline && (
                    <Chevron
                        className={classNames(
                            styles.chevron,
                            isOpen && styles.openChevron
                        )}
                    />
                )}
                {isNotFound && <div>Not found</div>}
                {isLoading && <Loading />}
                {isError && <Error className={styles.error} />}

                {isContentAvailable && isInline && (
                    <div className={styles.inlineContent}>{children}</div>
                )}
            </header>

            {isContentAvailable && !isInline && (
                <Collapse isOpened={isOpen}>
                    <article className={styles.content}>{children}</article>

                    <button
                        onClick={() => setOpen(false)}
                        className={styles.hideButton}
                    >
                        <Chevron className={styles.hideChevron} />
                    </button>
                </Collapse>
            )}
        </section>
    );
}
