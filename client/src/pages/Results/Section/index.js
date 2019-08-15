import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import Header from "./Header";
import ExpandableContent from "./ExpandableContent";

export default function Section({
    title,
    isLoading,
    error,
    children,
    isInline,
    "data-testid": dataTestId
}) {
    const [isOpen, setOpen] = useState(false);
    useEffect(() => setOpen(false), [children]);

    const isContentAvailable = !isLoading && error === null;
    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;

    function toggleOpen() {
        setOpen(!isOpen);
    }

    function collapse() {
        setOpen(false);
    }

    return (
        <section
            className={classNames(
                styles.container,
                (isNotFound || isError) && styles.unavailable
            )}
            data-testid={dataTestId}
        >
            <Header
                title={title}
                onClick={isContentAvailable && !isInline && toggleOpen}
                canExpand={isContentAvailable && !isInline}
                isOpen={isOpen}
                isNotFound={isNotFound}
                isLoading={isLoading}
                isError={isError}
            >
                {isContentAvailable && isInline && children}
            </Header>

            {isContentAvailable && !isInline && (
                <ExpandableContent isOpen={isOpen} onCollapse={collapse}>
                    {children}
                </ExpandableContent>
            )}
        </section>
    );
}
