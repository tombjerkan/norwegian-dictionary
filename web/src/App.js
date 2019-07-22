import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import ResultPage from "./ResultPage";

function App() {
    return (
        <BrowserRouter>
            <Route exact path="/" component={SearchPage} />
            <Route path="/:query" component={ResultPage} />
        </BrowserRouter>
    );
}

export default App;
