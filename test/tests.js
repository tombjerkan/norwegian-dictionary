import {
    addTestcafeTestingLibrary,
    getByTestId,
    getByText,
    getByPlaceholderText
} from "@testing-library/testcafe";

fixture`End-to-end tests`.beforeEach(addTestcafeTestingLibrary)
    .page`http://localhost:3000`;

test("Can search for word from home", async t => {
    await t
        .typeText(getByPlaceholderText("Search..."), "nordmann")
        .pressKey("enter");

    const ordbokSection = getByTestId("ordbok");
    await t
        .click(ordbokSection, getByText("Show"))
        .expect(ordbokSection.innerText)
        .contains("person fra Norge");

    const wiktionarySection = getByTestId("wiktionary")
    await t
        .click(wiktionarySection, getByText("Show"))
        .expect(wiktionarySection.innerText)
        .contains(
            "a Norwegian (person of Norwegian ancestry or inhabitant of Norway)"
        );

    const googleTranslateSection = getByTestId("google-translate")
    await t
        .click(googleTranslateSection, getByText("Show"))
        .expect(googleTranslateSection.innerText)
        .contains("Norwegian");
});
