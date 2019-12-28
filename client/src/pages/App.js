import React from "react";
import { useLocation } from "routing";
import SearchPage from "./SearchPage";
import StarredPage from "./StarredPage";

export default function App() {
	const location = useLocation();

    if (location.pathname === "/" || location.pathname.startsWith("/search")) {
        return <SearchPage />;
    } else if (location.pathname === "/starred") {
        return <StarredPage />;
    }
}
