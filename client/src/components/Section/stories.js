import React from "react";
import { storiesOf } from "@storybook/react";

import Section from ".";

storiesOf("Section2", module)
    .add("default", () => (
        <Section>
            <h2>Lorem</h2>
        </Section>
    ))
    .add("unavailable", () => (
        <Section isAvailable={false}>
            <h2>Ipsum</h2>
        </Section>
    ));
