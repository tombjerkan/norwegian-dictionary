import React from "react";
import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import "../src/index.css";

const req = require.context("../src", true, /\/stories.js$|\.stories.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

const history = createMemoryHistory();
history.push = action("history.push");
history.replace = action("history.replace");
history.go = action("history.go");
history.goBack = action("history.goBack");
history.goForward = action("history.goForward");

addDecorator(story => <Router history={history}>{story()}</Router>);

configure(loadStories, module);
