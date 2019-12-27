import React from "react";
import Text from "components/Text";
import { ExpandableSection } from "../Section";
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

export default function Ordbok({ data, isLoading, error }) {
    return (
        <ExpandableSection title="Ordbok" isLoading={isLoading} error={error}>
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
                                        <Text text={sense.definition} />
                                    </SubHeader>

                                    <Examples>
                                        <Text text={sense.examples} />
                                    </Examples>

                                    {sense.subDefinitions.map(subDefinition => (
                                        <SubDefinition
                                            definition={
                                                subDefinition.definition
                                            }
                                            examples={subDefinition.examples}
                                        />
                                    ))}

                                    {sense.subEntries.map(subEntry => (
                                        <SubEntry
                                            term={subEntry.term}
                                            definition={subEntry.definition}
                                        />
                                    ))}
                                </Sense>
                            ))}
                        </SenseList>
                    </Entry>
                ))}
        </ExpandableSection>
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
