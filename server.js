const express = require("express");
const path = require("path");
const api = require("./api");

const app = express();

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "./web/build")));
}

app.use("/api", api);

if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "./web/build", "index.html")));
}

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));