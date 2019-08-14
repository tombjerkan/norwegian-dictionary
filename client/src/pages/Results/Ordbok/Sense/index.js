import React from "react";
import TextWithLinks from "components/TextWithLinks";
import SubDefinition from "./SubDefinition";
import SubEntry from "./SubEntry";
import styles from "./styles.module.css";

export default function Sense({ sense }) {
    return (
        <li>
            <h4 className={styles.header}>
                <TextWithLinks text={sense.definition} />
            </h4>

            <p className={styles.examples}>
                <TextWithLinks text={sense.examples} />
            </p>

            {sense.subDefinitions.map(subDefinition => (
                <SubDefinition subDefinition={subDefinition} />
            ))}

            {sense.subEntries.map(subEntry => (
                <SubEntry subEntry={subEntry} />
            ))}
        </li>
    );
}
