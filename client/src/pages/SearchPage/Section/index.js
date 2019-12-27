import React, { useState } from "react";
import classNames from "classnames";
import Loading from "components/Loading";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import styles from "./styles.module.css";

export function Section({ children }) {
    return <section className={styles.section}>{children}</section>;
}

export function Header({ title, isLoading, error, onClick, children }) {
    const isNotFound = !isLoading && error === 404;
    const isError = !isLoading && error !== null && error !== 404;

    return (
        <div onClick={onClick} className={styles.header}>
            <h2 className={styles.title}>{title}</h2>

            {isLoading && <Loading />}
            {isNotFound && <div>Not available</div>}
            {isError && <div>Error</div>}

            {children}
        </div>
    );
}

export function ExpandableSection({ title, isLoading, error, children }) {
    const [isOpen, setOpen] = useState(false);

    const toggleOpen = () => setOpen(prev => !prev);
    const close = () => setOpen(false);

    const isContentAvailable = !isLoading && error === null;

    return (
        <Section>
            <Header
                title={title}
                isLoading={isLoading}
                error={error}
                onClick={toggleOpen}
            >
                {isContentAvailable && (
                    <Chevron
                        className={classNames(
                            styles.chevron,
                            isOpen && styles.closeChevron
                        )}
                    />
                )}
            </Header>

            {isContentAvailable && isOpen && (
                <>
                    <div className={styles.expandableContent}>{children}</div>
                    <button onClick={close} className={styles.closeButton}><Chevron className={styles.buttonChevron} /></button>
                </>
            )}
        </Section>
    );
}
