import React from "react";
import TailwindThemeProvider from "../tailwind/TailwindThemeProvider";
import SearchPage from "./SearchPage";

export default function App() {
    return (
        <TailwindThemeProvider>
            <SearchPage  />
        </TailwindThemeProvider>
    );
}
