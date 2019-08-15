import React from "react";
import classNames from "classnames";
import Loading from "components/Loading";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import { ReactComponent as Error } from "components/Error.svg";
import styles from "./styles.module.css";

export default function Header({
    title,
    onClick,
    canExpand,
    isOpen,
    isNotFound,
    isLoading,
    isError,
    children
}) {
    return (
        <header
            className={classNames(
                styles.header,
                canExpand && styles.clickableHeader
            )}
            onClick={onClick}
        >
            <h2 className={styles.title}>{title}</h2>

            {canExpand && (
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

            {children}
        </header>
    );
}
