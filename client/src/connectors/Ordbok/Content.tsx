import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

import { Entry } from "./types";

interface Props {
  data: Entry[];
}

export default function OrdbokContent(props: Props) {
  const sanitisedData = props.data.map((entry) => ({
    term: entry.term,
    content: DomPurify.sanitize(entry.content),
  }));

  return (
    <>
      {sanitisedData.map((entry) => (
        <>
          <Header>{entry.term}</Header>
          <Container dangerouslySetInnerHTML={{ __html: entry.content }} />
        </>
      ))}
    </>
  );
}

const Header = styled.h3`
  font-weight: ${(props) => props.theme.fontWeight.bold};
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.gray[900]};
  margin-bottom: ${(props) => props.theme.spacing[4]};

  &:not(:first-child) {
    margin-top: ${(props) => props.theme.spacing[10]};
  }
`;

const Container = styled.div`
  color: ${(props) => props.theme.colors.gray[700]};

  a {
    color: ${(props) => props.theme.colors.blue[600]};
  }

  a:hover {
    text-decoration: underline;
  }

  .tyding {
    margin-left: ${(props) => props.theme.spacing[4]};
    text-indent: -${(props) => props.theme.spacing[4]};
  }

  .doemeliste {
    margin-left: 0;
    text-indent: 0;
  }

  .oppslagsord {
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }

  .artikkeloppslagsord {
    font-weight: ${(props) => props.theme.fontWeight.bold};
  }
`;
