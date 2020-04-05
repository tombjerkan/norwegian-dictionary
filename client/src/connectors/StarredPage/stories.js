import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StarredPage from ".";

storiesOf("StarredPage", module)
    .add("default", () => (
        <StarredPage
            entries={[
                { term: "Term 1", notes: "These are some notes" },
                { term: "Term 2", notes: "These are more notes" }
            ]}
            onClickSearch={action("onClickSearch")}
            onDelete={action("onDelete")}
        />
    ))
    .add("empty", () => (
        <StarredPage
            entries={[]}
            onClickSearch={action("onClickSearch")}
            onDelete={action("onDelete")}
        />
    ));
