import React from "react";
import { storiesOf } from "@storybook/react";
import NavigationButton from ".";

storiesOf("NavigationButton", module).add("default", () => (
    <NavigationButton to="/test">Click here!</NavigationButton>
));
