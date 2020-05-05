import React from "react";
import { storiesOf } from "@storybook/react";
import Navigation from ".";

storiesOf("Navigation", module)
    .add("with single block child", () => (
        <Navigation>
            <div>Child</div>
        </Navigation>
    ))
    .add("with multiple block children", () => (
        <Navigation>
            <div>First Child</div>
            <div>Second Child</div>
        </Navigation>
    ));
