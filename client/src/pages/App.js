import React from "react";
import { useLocation } from "routing";
import SearchPage from "./SearchPage";
import StarredPage from "./StarredPage";
import "./App.css";

export default function App() {
    const location = useLocation();

    if (location.pathname === "/") {
        return <SearchPage />;
    } else if (location.pathname.startsWith("/search/")) {
        const query = location.pathname.slice(8);
        return <SearchPage query={query} />;
    } else if (location.pathname === "/starred") {
        return <StarredPage />;
    }
}
