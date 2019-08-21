import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SearchBox from ".";

storiesOf("SearchBox", module).add("default", () => (
    <SearchBox onSubmit={action("onSubmit")} />
));
