import React from "react";
import TextWithLinks from "components/TextWithLinks";
import SubDefinition from "pages/Results/Ordbok/SubDefinition";
import SubEntries from "pages/Results/Ordbok/SubEntries";
import styles from "./styles.module.css";

export default function Senses({ senses }) {
    if (senses.length === 0) {
        return null;
    }

    return (
        <ol className={styles.container}>
            {senses.map(sense => (
                <li>
                    <div className={styles.definition}>
                        <TextWithLinks text={sense.definition} />
                    </div>

                    <div className={styles.examples}>
                        <TextWithLinks text={sense.examples} />
                    </div>

                    {sense.subDefinitions.map(subDefinition => (
                        <SubDefinition subDefinition={subDefinition} />
                    ))}

                    <SubEntries subEntries={sense.subEntries} />
                </li>
            ))}
        </ol>
    );
}
