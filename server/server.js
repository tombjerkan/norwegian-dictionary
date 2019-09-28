require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const sentry = require("@sentry/node");
const api = require("./api");
const logger = require("./logger");

const app = express();

sentry.init({
    dsn: "https://e4c0973426a3496296ee7a2edafb7e24@sentry.io/1764489"
});

app.use(sentry.Handlers.requestHandler());
app.use(morgan("tiny", { stream: logger.stream }));

if (process.env.NODE_ENV === "production") {
    app.use(
        express.static(path.resolve(__dirname, process.env.CLIENT_BUILD_PATH))
    );
}

app.use("/api", api.router);

app.use(sentry.Handlers.errorHandler());
app.use(api.handleErrors);

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) =>
        res.sendFile(
            path.resolve(__dirname, process.env.CLIENT_BUILD_PATH, "index.html")
        )
    );
}

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
