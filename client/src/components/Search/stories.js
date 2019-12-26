import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Search from ".";
import { ReactComponent as Magnifier } from "./Magnifier.svg";

storiesOf("Search", module).add("default", () => (
    <Search onSubmit={action("onSubmit")} />
));
