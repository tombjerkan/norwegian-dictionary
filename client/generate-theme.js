const fs = require("fs");
const _ = require("lodash");
const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config");

const config = resolveConfig(tailwindConfig);

const include = ["colors", "spacing", "fontWeight", "fontSize"];

try {
    const selectedThemeProperties = _.pick(config.theme, include);
    fs.writeFileSync(
        "./src/tailwind/theme.generated.json",
        JSON.stringify(selectedThemeProperties)
    );
} catch (err) {
    console.error(err);
}
