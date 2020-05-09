import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        spacing: {
            px: string;
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
            "8": string;
            "10": string;
            "12": string;
            "16": string;
            "20": string;
            "24": string;
            "32": string;
            "40": string;
            "48": string;
            "56": string;
            "64": string;
            "120": string;
        };
        fontWeight: {
            hairline: string;
            thin: string;
            light: string;
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
            extrabold: string;
            black: string;
        };
    }
}
