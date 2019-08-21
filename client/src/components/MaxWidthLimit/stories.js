import React from "react";
import { storiesOf } from "@storybook/react";
import MaxWidthLimit from ".";

storiesOf("MaxWidthLimit", module).add("default", () => (
    <MaxWidthLimit>
        <div style={{ background: "#000", height: "100px" }} />
    </MaxWidthLimit>
));
