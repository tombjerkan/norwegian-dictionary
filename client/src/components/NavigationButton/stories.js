import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import NavigationButton from ".";

storiesOf("NavigationButton", module).add("default", () => (
    <NavigationButton to="/test">Click here!</NavigationButton>
));
