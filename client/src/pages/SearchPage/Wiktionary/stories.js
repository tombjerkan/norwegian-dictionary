import React from "react";
import { storiesOf } from "@storybook/react";
import { WiktionaryView } from ".";

storiesOf("Wiktionary", module).add("default", () => (
    <WiktionaryView data={testData} isLoading={false} error={null} />
));

const testData = `
<div>
 <h3>
  Etymology 1
 </h3>
 <h4>
  Adverb
 </h4>
 <p>
  <strong>
   for
  </strong>
 </p>
 <ol>
  <li>
   too
   <dl>
    <dd>
     <i>
      <b>
       for
      </b>
      ung
     </i>
     ―
     too young
    </dd>
    <dd>
     <i>
      <b>
       for
      </b>
      langt
     </i>
     ―
     too far
    </dd>
   </dl>
  </li>
 </ol>
 <h5>
  Synonyms
 </h5>
 <ul>
  <li>
   <a href="altfor">
    altfor
   </a>
  </li>
 </ul>
 <h3>
  Etymology 2
 </h3>
 <h4>
  Conjunction
 </h4>
 <p>
  <strong>
   for
  </strong>
 </p>
 <ol>
  <li>
   for
  </li>
 </ol>
 <h5>
  Synonyms
 </h5>
 <ul>
  <li>
   fordi
  </li>
 </ul>
 <h3>
  Etymology 3
 </h3>
 <p>
  From
  Old Norse
  <i>
   fóðr
  </i>
 </p>
 <h4>
  Noun
 </h4>
 <p>
  <strong>
   for
  </strong>
  <abbr>
   n
  </abbr>
  (
  <i>
   definite singular
  </i>
  <b>
   <a href="foret">
    foret
   </a>
  </b>
  ,
  <i>
   indefinite plural
  </i>
  <b>
   <strong>
    for
   </strong>
  </b>
  ,
  <i>
   definite plural
  </i>
  <b>
   <a href="fora">
    fora
   </a>
  </b>
  <i>
   or
  </i>
  <b>
   <a href="forene">
    forene
   </a>
  </b>
  )
 </p>
 <ol>
  <li>
   alternative form of
   <i>
    <a href="f%C3%B4r">
     fôr
    </a>
   </i>
  </li>
 </ol>
 <h5>
  Derived terms
 </h5>
 <ul>
  <li>
   <a href="dyrefor">
    dyrefor
   </a>
  </li>
  <li>
   <a href="fiskefor">
    fiskefor
   </a>
  </li>
 </ul>
 <h3>
  Etymology 4
 </h3>
 <h4>
  Preposition
 </h4>
 <p>
  <strong>
   for
  </strong>
 </p>
 <ol>
  <li>
   for
  </li>
 </ol>
 <h4>
  Derived terms
 </h4>
 <ul>
  <li>
   <a href="vestenfor">
    vestenfor
   </a>
  </li>
 </ul>
 <h3>
  Etymology 5
 </h3>
 <h4>
  Verb
 </h4>
 <p>
  <strong>
   for
  </strong>
 </p>
 <ol>
  <li>
   past
   tense
   of
   <i>
    <a href="fare">
     fare
    </a>
   </i>
   .
  </li>
 </ol>
</div>
`;
