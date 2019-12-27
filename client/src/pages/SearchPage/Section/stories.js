import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Section, Header } from ".";

storiesOf("Section", module)
    .add("default", () => (
        <Section>
            <Header
                title="Title"
                isLoading={false}
                error={null}
                onClick={action("onClick")}
            />
        </Section>
    ))
    .add("loading", () => (
        <Section>
            <Header
                title="Title"
                isLoading={true}
                error={null}
                onClick={action("onClick")}
            />
        </Section>
    ))
    .add("not found", () => (
        <Section>
            <Header
                title="Title"
                isLoading={false}
                error={404}
                onClick={action("onClick")}
            />
        </Section>
    ))

    .add("error", () => (
        <Section>
            <Header
                title="Title"
                isLoading={false}
                error={500}
                onClick={action("onClick")}
            />
        </Section>
    ));
