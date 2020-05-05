import React from "react";
import { useLocation } from "routing";
import SearchPage from "./SearchPage";
import StarredPage from "./StarredPage";
import "./App.css";

export default function App() {
    const pathName = useLocation();

    if (pathName === "/") {
        return <SearchPage query="" />;
    } else if (pathName.startsWith("/search/")) {
        const query = pathName.slice(8);
        return <SearchPage query={query} />;
    } else if (pathName === "/starred") {
        return <StarredPage />;
    } else {
        return <h1>Not found</h1>;
    }
}
