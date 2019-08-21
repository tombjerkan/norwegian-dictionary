import React from "react";
import { storiesOf } from "@storybook/react";
import TextWithLinks from ".";

storiesOf("TextWithLinks", module)
    .add("no links", () => (
        <TextWithLinks text="This is some text without a link." />
    ))
    .add("with links", () => (
        <TextWithLinks text="This is some text with a <Link to='link'>link</Link>." />
    ))
    .add("invalid element", () => (
        <TextWithLinks
            text={`This has an <NotAnElement>invalid element</NotAnElement>.`}
        />
    ));
