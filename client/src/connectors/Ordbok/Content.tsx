import React from "react";
import styled from "styled-components";
import DomPurify from "dompurify";

interface Props {
  articles: string[];
  inflections: string[];
}

export default function OrdbokContent(props: Props) {
  const sanitisedArticles = props.articles.map(article =>
    DomPurify.sanitize(article)
  );

  return (
    <>
      <ArticleContainer>
        {sanitisedArticles.map((html, index) => (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={index !== 0 ? "border-t mt-4 pt-4" : undefined}
          />
        ))}
      </ArticleContainer>

      {props.articles !== null && props.inflections.length > 0 && (
        <Separator />
      )}

      {props.inflections.length > 0 && (
        <Inflections inflections={props.inflections} />
      )}
    </>
  );
}

const ArticleContainer = styled.div`
  color: ${(props) => props.theme.colors.gray[700]};

  a {
    color: ${(props) => props.theme.colors.blue[600]};
  }

  a:hover {
    text-decoration: underline;
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
