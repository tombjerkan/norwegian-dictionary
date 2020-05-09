import React from "react";
import { storiesOf } from "@storybook/react";

import {
    Card,
    Error,
    ExpandArrow,
    Header,
    Loading,
    NotAvailable,
    Title
} from ".";

storiesOf("Section", module)
    .add("default", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                Some text in header
            </Header>
        </Card>
    ))
    .add("loading", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                <Loading />
            </Header>
        </Card>
    ))
    .add("not available", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                <NotAvailable />
            </Header>
        </Card>
    ))
    .add("error", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                <Error />
            </Header>
        </Card>
    ))
    .add("expandable - closed", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                <ExpandArrow isOpen={false} />
            </Header>
        </Card>
    ))
    .add("expandable - open with content", () => (
        <Card>
            <Header>
                <Title>Title</Title>
                <ExpandArrow isOpen={true} />
            </Header>
            Content outside of header
        </Card>
    ));
