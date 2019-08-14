import React from "react";
import TextWithLinks from "components/TextWithLinks";
import styles from "./styles.module.css";

export default function Sense({ sense }) {
    return (
        <li>
            <span className={styles.definition}>
                <TextWithLinks text={sense.definition} />
            </span>

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
    );
}
