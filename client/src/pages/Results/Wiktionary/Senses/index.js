import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function Senses({ senses }) {
    return (
        <ol className={styles.container}>
            {senses.map(sense => (
                <li>
                    <TextWithLinks text={sense.definition} />

                    {sense.examples && (
                        <ul className={styles.examples}>
                            {sense.examples.map(example => (
                                <li>
                                    <TextWithLinks text={example} />
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ol>
    );
}
