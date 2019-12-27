import React from "react";
import { storiesOf } from "@storybook/react";
import Wiktionary from ".";

const data = [
    {
        etymology:
            "Maecenas <Link to='odio'>odio</Link> lorem, volutpat ac imperdiet pulvinar, rutrum eget risus.",
        subEntries: [
            {
                type: "Verb",
                term: "imperdiet",
                senses: [
                    {
                        definition:
                            "Proin pretium turpis ac est blandit maximus.",
                        examples: [
                            "Sed",
                            "consectetur",
                            "massa",
                            "in",
                            "erat",
                            "euismod"
                        ]
                    }
                ]
            }
        ],
        synonyms: ["Sed", "consectetur", "massa", "in", "erat", "euismod"],
        derived: ["Sed", "consectetur", "massa", "in", "erat", "euismod"]
    },
    {
        etymology:
            "Maecenas odio lorem, volutpat ac imperdiet pulvinar, rutrum eget risus.",
        subEntries: [
            {
                type: "Verb",
                term: "imperdiet",
                senses: [
                    {
                        definition:
                            "Proin pretium turpis ac est blandit maximus.",
                        examples: [
                            "Sed",
                            "consectetur",
                            "massa",
                            "in",
                            "erat",
                            "euismod"
                        ]
                    }
                ]
            }
        ],
        synonyms: [],
        derived: []
    }
];

storiesOf("Wiktionary", module).add("default", () => (
    <Wiktionary data={data} isLoading={false} error={null} />
));
