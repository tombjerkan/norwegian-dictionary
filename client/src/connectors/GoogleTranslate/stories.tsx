import React from "react";
import { storiesOf } from "@storybook/react";
import { GoogleTranslateView } from ".";

storiesOf("GoogleTranslate", module)
    .add("default", () => (
        <GoogleTranslateView
            data="apparently"
            isLoading={false}
            isUnavailable={false}
            isError={false}
        />
    ))
    .add("loading", () => (
        <GoogleTranslateView
            data="apparently"
            isLoading={true}
            isUnavailable={false}
            isError={false}
        />
    ))
    .add("error (404)", () => (
        <GoogleTranslateView
            data="apparently"
            isLoading={false}
            isUnavailable={true}
            isError={false}
        />
    ))
    .add("error (other)", () => (
        <GoogleTranslateView
            data="apparently"
            isLoading={false}
            isUnavailable={false}
            isError={true}
        />
    ));
