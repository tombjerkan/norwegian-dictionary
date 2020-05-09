import React from "react";
import { storiesOf } from "@storybook/react";
import { WiktionaryView } from ".";
import WiktionaryContent from "./Content";

storiesOf("Wiktionary", module).add("default", () => (
    <WiktionaryView
        data={testData}
        isLoading={false}
        isUnavailable={false}
        isError={false}
    />
));

storiesOf("Wiktionary", module).add("content", () => (
    <WiktionaryContent data={testData} />
));

const testData = `<div><h3><span class="mw-headline">Etymology 1</span></h3><h4><span class="mw-headline">Adverb</span></h4><p><strong class="Latn headword">for</strong></p><ol><li>too<dl><dd><div class="h-usage-example"><i class="Latn mention e-example"><b>for</b> ung</i> ― <span class="e-translation">too young</span></div></dd><dd><div class="h-usage-example"><i class="Latn mention e-example"><b>for</b> langt</i> ― <span class="e-translation">too far</span></div></dd></dl></li></ol><h5><span class="mw-headline">Synonyms</span></h5><ul><li><span class="Latn"><a href="altfor">altfor</a></span></li></ul><h3><span class="mw-headline">Etymology 2</span></h3><h4><span class="mw-headline">Conjunction</span></h4><p><strong class="Latn headword">for</strong></p><ol><li>for</li></ol><h5><span class="mw-headline">Synonyms</span></h5><ul><li><span class="Latn"><a href="fordi">fordi</a></span></li></ul><h3><span class="mw-headline">Etymology 3</span></h3><p>From <span class="etyl">Old Norse</span> <i class="Latn mention">fóðr</i></p><h4><span class="mw-headline">Noun</span></h4><p><strong class="Latn headword">for</strong> <span class="gender"><abbr>n</abbr></span> (<i>definite singular</i> <b class="Latn"><a href="foret">foret</a></b>, <i>indefinite plural</i> <b class="Latn"><strong class="selflink">for</strong></b>, <i>definite plural</i> <b class="Latn"><a href="fora">fora</a></b> <i>or</i> <b class="Latn"><a href="forene">forene</a></b>)
</p><ol><li><span class="form-of-definition use-with-mention">alternative form of <span class="form-of-definition-link"><i class="Latn mention"><a href="f%C3%B4r">fôr</a></i></span></span></li></ol><h5><span class="mw-headline">Derived terms</span></h5><ul><li><span class="Latn"><a href="dyrefor">dyrefor</a></span></li><li><span class="Latn"><a href="fiskefor">fiskefor</a></span></li></ul><h3><span class="mw-headline">Etymology 4</span></h3><h4><span class="mw-headline">Preposition</span></h4><p><strong class="Latn headword">for</strong></p><ol><li>for</li></ol><h4><span class="mw-headline">Derived terms</span></h4><ul><li><span class="Latn"><a href="vestenfor">vestenfor</a></span></li></ul><h3><span class="mw-headline">Etymology 5</span></h3><h4><span class="mw-headline">Verb</span></h4><p><strong class="Latn headword">for</strong></p><ol><li><span class="form-of-definition use-with-mention">past tense of <span class="form-of-definition-link"><i class="Latn mention"><a href="fare">fare</a></i></span></span>.</li></ol></div>`;
