import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Search from "./Search";
import Results from "./Results";

export default function App() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={Search} />
            <Route path="/:query" component={Results} />
        </BrowserRouter>
    );
}
