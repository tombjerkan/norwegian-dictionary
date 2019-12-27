import React from "react";
import { storiesOf } from "@storybook/react";
import GoogleTranslate from ".";

storiesOf("GoogleTranslate", module).add("default", () => (
    <GoogleTranslate data="apparently" isLoading={false} error={null} />
));
