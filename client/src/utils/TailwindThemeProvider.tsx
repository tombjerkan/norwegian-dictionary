import React from "react";
import { ThemeProvider, DefaultTheme } from "styled-components";
import tailwindTheme from "../tailwind-theme.js";

interface Props {
    children: React.ReactNode;
}

export default function TailwindThemeProvider(props: Props) {
    return (
        // 'as DefaultTheme' for now as have not full defined DefaultTheme in styled.d.ts
        <ThemeProvider theme={tailwindTheme as DefaultTheme}>
            {props.children}
        </ThemeProvider>
    );
}
