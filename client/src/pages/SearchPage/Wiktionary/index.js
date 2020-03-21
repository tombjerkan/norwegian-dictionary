import React, { useState } from "react";
import classNames from "classnames";
import Section from "components/Section";
import Text from "components/Text";
import Loading from "components/Loading";
import { ReactComponent as Error } from "components/Error.svg";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import useFetch from "../useFetch";
import {
    Entry,
    Header,
    SubHeader,
    Etymology,
    SenseList,
    Sense,
    Paragraph,
    Examples
} from "../common";
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
                {isContentAvailable && (
                    <Chevron
                        className={classNames(
                            styles.chevron,
                            isOpen && styles.closeChevron
                        )}
                    />
                )}
            </div>

            {isContentAvailable && isOpen && (
                <>
                    <div className={styles.expandableContent}>
                        {data &&
                            data.map((entry, index) => (
                                <Entry>
                                    <Header>Etymology {index + 1}</Header>

                                    <Etymology>
                                        <Text text={entry.etymology} />
                                    </Etymology>

                                    {entry.subEntries.map(subEntry => (
                                        <>
                                            <SubHeader>
                                                {subEntry.type}
                                            </SubHeader>

                                            <Paragraph>
                                                <Text text={subEntry.term} />
                                            </Paragraph>

                                            <SenseList>
                                                {subEntry.senses.map(sense => (
                                                    <Sense>
                                                        <Text
                                                            text={
                                                                sense.definition
                                                            }
                                                        />
                                                        {sense.examples.map(
                                                            example => (
                                                                <Examples
                                                                    className={
                                                                        styles.examples
                                                                    }
                                                                >
                                                                    <Text
                                                                        text={
                                                                            example
                                                                        }
                                                                    />
                                                                </Examples>
                                                            )
                                                        )}
                                                    </Sense>
                                                ))}
                                            </SenseList>
                                        </>
                                    ))}

                                    {entry.synonyms.length > 0 && (
                                        <>
                                            <SubHeader>Synonyms</SubHeader>
                                            <Paragraph>
                                                <Text
                                                    text={entry.synonyms.join(
                                                        ", "
                                                    )}
                                                />
                                            </Paragraph>
                                        </>
                                    )}

                                    {entry.derived.length > 0 && (
                                        <>
                                            <SubHeader>Derived</SubHeader>
                                            <Paragraph>
                                                <Text
                                                    text={entry.derived.join(
                                                        ", "
                                                    )}
                                                />
                                            </Paragraph>
                                        </>
                                    )}
                                </Entry>
                            ))}
                    </div>

                    <button onClick={close} className={styles.closeButton}>
                        <Chevron className={styles.buttonChevron} />
                    </button>
                </>
            )}
        </Section>
    );
}
