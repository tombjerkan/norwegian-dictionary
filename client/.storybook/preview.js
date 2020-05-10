import React from "react";
import { addDecorator } from "@storybook/react";

import TailwindThemeProvider from "../src/tailwind/TailwindThemeProvider";
import "../src/tailwind/tailwind.generated.css";

addDecorator(storyFn => (
    <TailwindThemeProvider>{storyFn()}</TailwindThemeProvider>
));
