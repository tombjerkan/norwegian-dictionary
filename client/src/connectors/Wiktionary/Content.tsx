import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

interface Props {
    data: string;
}

export default function WiktionaryContent(props: Props) {
    const sanitisedData = DomPurify.sanitize(props.data);

    return <Container dangerouslySetInnerHTML={{ __html: sanitisedData }} />;
}

const Container = styled.div`
    b,
    strong {
        font-weight: ${props => props.theme.fontWeight.bold};
    }

    .use-with-mention,
    .form-of-definition {
        font-style: italic;
    }

    .form-of-definition-link {
        font-style: normal;
    }

    .gender,
    .number,
    .noun-class {
        font-style: italic;
    }

    .mention {
        font-style: italic;
    }

    .use-with-mention .mention,
    .form-of-definition-link .mention {
        font-style: normal;
        font-weight: ${props => props.theme.fontWeight.bold};
    }
`;
