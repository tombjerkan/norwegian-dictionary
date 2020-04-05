import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { SearchPageView as SearchPage } from ".";

const wiktionaryData = [
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

const ordbokData = [
    {
        term: "Lorem",
        etymology:
            "Maecenas <Link to='odio'>odio</Link> lorem, volutpat ac imperdiet pulvinar, rutrum eget risus.",
        senses: [
            {
                definition: "Maecenas odio lorem",
                examples: "Proin pretium turpis",
                subDefinitions: [
                    {
                        definition: "Volutpat ac imperdiet pulvinar",
                        examples: "Est blandit maximus"
                    }
                ],
                subEntries: [
                    {
                        term: "Volutpat ac imperdiet pulvinar",
                        definition: "Est blandit maximus"
                    }
                ]
            }
        ]
    }
];

storiesOf("SearchPage", module).add("default", () => (
    <SearchPage
        googleTranslate={{
            data: "apparently",
            isLoading: false,
            error: null
        }}
        wiktionary={{
            data: wiktionaryData,
            isLoading: false,
            error: null
        }}
        ordbok={{
            data: ordbokData,
            isLoading: false,
            error: null
        }}
        onSearch={action("onSearch")}
        onClickStarred={action("onClickStarred")}
    />
));
