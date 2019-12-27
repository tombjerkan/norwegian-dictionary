import React from "react";
import Text from "components/Text";
import { ExpandableSection } from "../Section";
import { Header, SubHeader } from "../Header";
import styles from "./styles.module.css";

export default function Wiktionary({ data, isLoading, error }) {
    return (
        <ExpandableSection
            title="Wiktionary"
            isLoading={isLoading}
            error={error}
        >
            {data && data.map((entry, index) => (
                <div className={styles.entry}>
                    <Header>Etymology {index + 1}</Header>

                    <p className={styles.etymology}>
                        <Text text={entry.etymology} />
                    </p>

                    {entry.subEntries.map(subEntry => (
                        <div className={styles.subEntry}>
                            <SubHeader>{subEntry.type}</SubHeader>

                            <p className={styles.term}>
                                <Text text={subEntry.term} />
                            </p>

                            <ol className={styles.senses}>
                                {subEntry.senses.map(sense => (
                                    <li>
                                        <Text text={sense.definition} />
                                        {sense.examples.map(example => (
                                            <div className={styles.example}>
                                                <Text text={example} />
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}

                    {entry.synonyms.length > 0 && (
                        <>
                            <SubHeader>Synonyms</SubHeader>
                            <Text text={entry.synonyms.join(", ")} />
                        </>
                    )}

                    {entry.derived.length > 0 && (
                        <>
                            <SubHeader>Derived</SubHeader>
                            <Text text={entry.derived.join(", ")} />
                        </>
                    )}
                </div>
            ))}
        </ExpandableSection>
    );
}
