import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Search from "./Search";
import Starred from "./Starred";
import Results from "./Results";

export default function App() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Search} />
            <Route exact path="/starred" component={Starred} />
            <Route path="/results/:query" component={Results} />
        </BrowserRouter>
    );
}
