import React from "react";
import { storiesOf } from "@storybook/react";
import { GoogleTranslateView } from ".";

storiesOf("GoogleTranslate", module)
    .add("default", () => (
        <GoogleTranslateView data="apparently" isLoading={false} error={null} />
    ))
    .add("loading", () => (
        <GoogleTranslateView data={null} isLoading={true} error={null} />
    ))
    .add("error (404)", () => (
        <GoogleTranslateView data={null} isLoading={false} error={404} />
    ))
    .add("error (other)", () => (
        <GoogleTranslateView data={null} isLoading={false} error={500} />
    ));
