import React from "react";
import { storiesOf } from "@storybook/react";

import Link from ".";

storiesOf("Link", module).add("default", () => (
    <>
        This sentence has a <Link to="#">link</Link>.
    </>
));
