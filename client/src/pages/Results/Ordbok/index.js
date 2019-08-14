import React from "react";
import Section from "pages/Results/Section";
import useFetch from "pages/Results/useFetch";
import Entry from "pages/Results/Entry";
import Sense from "./Sense";
import styles from "./styles.module.css";

export default function Ordbok({ query }) {
    const [data, isLoading, error] = useFetch(`/api/ordbok/${query}`, []);

    return (
        <Section
            title="Ordbok"
            isLoading={isLoading}
            error={error}
            data-testid="ordbok"
        >
            {data.map(entry => (
                <Entry header={entry.term} etymology={entry.etymology}>
                    <ol className={styles.senses}>
                        {entry.senses.map(sense => (
                            <Sense sense={sense} />
                        ))}
                    </ol>
                </Entry>
            ))}
        </Section>
    );
}
