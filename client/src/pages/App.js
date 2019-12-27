import React from "react";
import useHistory from "components/useHistory";
import SearchPage from "./SearchPage";
import StarredPage from "./StarredPage";

export default function App() {
    const [location] = useHistory();

    if (location.pathname === "/" || location.pathname.startsWith("/search")) {
        return <SearchPage />;
    } else if (location.pathname === "/starred") {
        return <StarredPage />;
    }
}
