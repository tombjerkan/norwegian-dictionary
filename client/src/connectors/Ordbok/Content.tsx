import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

import { Entry } from "./types";

interface Props {
    data: Entry[];
}

export default function OrdbokContent(props: Props) {
    const sanitisedData = props.data.map(entry => ({
        term: entry.term,
        content: DomPurify.sanitize(entry.content)
    }));

    return (
        <>
            {sanitisedData.map(entry => (
                <>
                    <h1>{entry.term}</h1>
                    <Container
                        dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                </>
            ))}
        </>
    );
}

const Container = styled.div`
    .tyding {
        margin-left: ${props => props.theme.spacing[4]};
        text-indent: -${props => props.theme.spacing[4]};
    }

    .doemeliste {
        margin-left: 0;
        text-indent: 0;
    }

    .oppslagsord {
        font-weight: ${props => props.theme.fontWeight.bold};
    }

    .artikkeloppslagsord {
        font-weight: ${props => props.theme.fontWeight.bold};
    }
`;
