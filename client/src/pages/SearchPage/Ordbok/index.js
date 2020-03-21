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
                            data.map(entry => (
                                <Entry>
                                    <Header>{entry.term}</Header>

                                    <Etymology>
                                        <Text text={entry.etymology} />
                                    </Etymology>

                                    <SenseList>
                                        {entry.senses.map(sense => (
                                            <Sense>
                                                <SubHeader>
                                                    <Text
                                                        text={sense.definition}
                                                    />
                                                </SubHeader>

                                                <Examples>
                                                    <Text
                                                        text={sense.examples}
                                                    />
                                                </Examples>

                                                {sense.subDefinitions.map(
                                                    subDefinition => (
                                                        <SubDefinition
                                                            definition={
                                                                subDefinition.definition
                                                            }
                                                            examples={
                                                                subDefinition.examples
                                                            }
                                                        />
                                                    )
                                                )}

                                                {sense.subEntries.map(
                                                    subEntry => (
                                                        <SubEntry
                                                            term={subEntry.term}
                                                            definition={
                                                                subEntry.definition
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Sense>
                                        ))}
                                    </SenseList>
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

function SubDefinition({ definition, examples }) {
    return (
        <div className={styles.subDefinition}>
            <SubHeader>
                <Text text={definition} />
            </SubHeader>

            <Examples>
                <Text text={examples} />
            </Examples>
        </div>
    );
}

function SubEntry({ term, definition }) {
    return (
        <Paragraph>
            <span className={styles.subEntryTerm}>
                <Text text={term} />
            </span>{" "}
            <span className={styles.subEntryDefinition}>
                <Text text={definition} />
            </span>
        </Paragraph>
    );
}
