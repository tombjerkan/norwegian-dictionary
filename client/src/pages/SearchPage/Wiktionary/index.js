import React from "react";
import Text from "components/Text";
import useFetch from "../useFetch";
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

export default function WiktionaryContainer({ query }) {
    const [data, isLoading, error] = useFetch(`/api/wiktionary/${query}`);

    return <WiktionaryView data={data} isLoading={isLoading} error={error} />;
}

export function WiktionaryView({ data, isLoading, error }) {
    return (
        <ExpandableSection
            title="Wiktionary"
            isLoading={isLoading}
            error={error}
        >
            {data &&
                data.map((entry, index) => (
                    <Entry>
                        <Header>Etymology {index + 1}</Header>

                        <Etymology>
                            <Text text={entry.etymology} />
                        </Etymology>

                        {entry.subEntries.map(subEntry => (
                            <>
                                <SubHeader>{subEntry.type}</SubHeader>

                                <Paragraph>
                                    <Text text={subEntry.term} />
                                </Paragraph>

                                <SenseList>
                                    {subEntry.senses.map(sense => (
                                        <Sense>
                                            <Text text={sense.definition} />
                                            {sense.examples.map(example => (
                                                <Examples
                                                    className={styles.examples}
                                                >
                                                    <Text text={example} />
                                                </Examples>
                                            ))}
                                        </Sense>
                                    ))}
                                </SenseList>
                            </>
                        ))}

                        {entry.synonyms.length > 0 && (
                            <>
                                <SubHeader>Synonyms</SubHeader>
                                <Paragraph>
                                    <Text text={entry.synonyms.join(", ")} />
                                </Paragraph>
                            </>
                        )}

                        {entry.derived.length > 0 && (
                            <>
                                <SubHeader>Derived</SubHeader>
                                <Paragraph>
                                    <Text text={entry.derived.join(", ")} />
                                </Paragraph>
                            </>
                        )}
                    </Entry>
                ))}
        </ExpandableSection>
    );
}
