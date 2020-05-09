import React from "react";
import { addDecorator } from "@storybook/react";

import TailwindThemeProvider from "../src/utils/TailwindThemeProvider";
import "../src/tailwind.generated.css";

addDecorator(storyFn => (
    <TailwindThemeProvider>{storyFn()}</TailwindThemeProvider>
));
