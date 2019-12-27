import React from "react";
import { storiesOf } from "@storybook/react";
import Ordbok from ".";

const data = [
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

storiesOf("Ordbok", module).add("default", () => (
    <Ordbok data={data} isLoading={false} error={null} />
));
