require("dotenv").config();
const express = require("express");
const path = require("path");
const api = require("./api");

const app = express();

if (process.env.NODE_ENV === "production") {
    app.use(
        express.static(path.resolve(__dirname, process.env.CLIENT_BUILD_PATH))
    );
}

app.use("/api", api);

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, process.env.CLIENT_BUILD_PATH, "index.html"))
    );
}

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
