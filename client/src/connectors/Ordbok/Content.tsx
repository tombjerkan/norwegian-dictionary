import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

interface Props {
  data: string;
}

export default function OrdbokContent(props: Props) {
  const sanitisedData = DomPurify.sanitize(props.data);

  return <Container dangerouslySetInnerHTML={{ __html: sanitisedData }} />;
}

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
