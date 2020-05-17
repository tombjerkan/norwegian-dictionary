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
  color: ${(props) => props.theme.colors.gray[700]};

  h3 {
    font-weight: ${(props) => props.theme.fontWeight.bold};
    font-size: ${(props) => props.theme.fontSize.lg};
    color: ${(props) => props.theme.colors.gray[900]};
  }

  h3:not(:first-child) {
    margin-top: ${(props) => props.theme.spacing[10]};
  }

  h4 {
    font-weight: ${(props) => props.theme.fontWeight.bold};
    color: ${(props) => props.theme.colors.gray[900]};
    margin-top: ${(props) => props.theme.spacing[4]};
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }

  h5 {
    font-weight: ${(props) => props.theme.fontWeight.bold};
    font-size: ${(props) => props.theme.fontSize.sm};
    color: ${(props) => props.theme.colors.gray[900]};
    margin-top: ${(props) => props.theme.spacing[4]};
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }

  p {
    margin-top: ${(props) => props.theme.spacing[2]};
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }

  a {
    color: ${(props) => props.theme.colors.blue[600]};
  }

  a:hover {
    text-decoration: underline;
  }

  ol {
      list-style: decimal;
      padding-left: ${(props => props.theme.spacing[8])};
  }

  b,
  strong {
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }

  dl {
    margin-left: ${(props) => props.theme.spacing["4"]};
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
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }
`;
