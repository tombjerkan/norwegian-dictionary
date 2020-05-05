import React from "react";
import { storiesOf } from "@storybook/react";

import ExpandChevron from ".";

storiesOf("ExpandChevron", module)
    .add("open", () => <ExpandChevron isOpen={true} />)
    .add("close", () => <ExpandChevron isOpen={false} />);
