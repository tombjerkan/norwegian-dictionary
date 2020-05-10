import React from "react";
import { useLocation } from "routing";
import TailwindThemeProvider from "../utils/TailwindThemeProvider";
import SearchPage from "./SearchPage";
import StarredPage from "./StarredPage";

export default function App() {
    const pathName = useLocation();

    return (
        <TailwindThemeProvider>
            {pathName === "/" && <SearchPage query="" />}
            {pathName.startsWith("/search/") && (
                <SearchPage query={pathName.slice(8)} />
            )}
            {pathName === "/starred" && <StarredPage />}
        </TailwindThemeProvider>
    );
}
