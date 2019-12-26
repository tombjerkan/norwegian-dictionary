import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Loading from ".";

storiesOf("Loading", module).add("default", () => <Loading />);
