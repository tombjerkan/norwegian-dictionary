import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

interface Props {
  content: string | null;
  inflections: string[];
}

export default function OrdbokContent(props: Props) {
  const sanitisedData = DomPurify.sanitize(props.content!);

  return (
    <>
      <Content dangerouslySetInnerHTML={{ __html: sanitisedData }} />

      {props.content !== null && props.inflections.length > 0 && <Separator />}

      {props.inflections.length > 0 && (
        <Inflections inflections={props.inflections} />
      )}
    </>
  );
}

const Content = styled.div`
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

const Inflections = (props: { inflections: string[] }) => (
  <div className="px-4">
    Inflections:
    <ul className="flex gap-2">
      {props.inflections.map((inflection) => (
        <a href={`/${inflection}`} className="text-blue-600 hover:underline">
          {inflection}
        </a>
      ))}
    </ul>
  </div>
);

const Separator = () => <div className="border-t mb-4 mt-4" />;
