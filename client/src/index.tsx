import React from "react";
import ReactDOM from "react-dom";
import "./font/inter.css";
import "./tailwind/tailwind.generated.css";
import App from "connectors/App";
import * as serviceWorker from "serviceWorker";
import axios from "axios";

if (process.env.NODE_ENV === "production") {
    axios.defaults.baseURL = "https://9rh4ybbi57.execute-api.eu-west-2.amazonaws.com/Prod";
} else {
    axios.defaults.baseURL = "http://127.0.0.1:3000";
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
