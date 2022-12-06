import React from "react";
import { history, useLocation } from "routing";
import Navigation from "components/Navigation";
import Search from "components/Search";
import GoogleTranslate from "./GoogleTranslate";
import Ordbok from "./Ordbok";
import Wiktionary from "./Wiktionary";

export default function SearchPageContainer() {
  const pathName = useLocation();
  const query = pathName.slice(1);

  return <SearchPageView query={query} />;
}

interface ViewProps {
  query: string;
}

export function SearchPageView(props: ViewProps) {
  function handleSearch(query: string) {
    history.push(`/${query}`);
  }

  return (
    <>
      <Navigation className="mb-8">
        <Search
          onSubmit={handleSearch}
          initialValue={props.query}
          className="flex-1 mr-3"
        />
      </Navigation>

      {props.query && (
        <div className="max-width-limit pb-8 space-y-8">
          <GoogleTranslate query={props.query} />
          <Wiktionary query={props.query} />
          <Ordbok query={props.query} />
        </div>
      )}
    </>
  );
}
