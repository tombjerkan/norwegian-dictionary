import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Search from ".";

storiesOf("Search", module).add("default", () => <Search history={{ push: action("history.push") }} />);
