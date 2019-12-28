import React from "react";
import { storiesOf } from "@storybook/react";
import { GoogleTranslateView } from ".";

storiesOf("GoogleTranslate", module).add("default", () => (
    <GoogleTranslateView data="apparently" isLoading={false} error={null} />
));
