import { Selector } from "testcafe";

fixture`End-to-end tests`.page`http://localhost:3000`;

test("Can search for word and find definition", async t => {
    await t
        .typeText("input[type='text']", "nordmann")
        .click("input[type='submit']")
        .click(
            Selector("#ordbok")
                .find("button")
                .withText("Show")
        )
        .expect(Selector("#ordbok").innerText)
        .contains("person fra Norge")
        .click(
            Selector("#wiktionary")
                .find("button")
                .withText("Show")
        )
        .expect(Selector("#wiktionary").innerText)
        .contains(
            "a Norwegian (person of Norwegian ancestry or inhabitant of Norway)"
        )
        .click(
            Selector("#google-translate")
                .find("button")
                .withText("Show")
        )
        .expect(Selector("#google-translate").innerText)
        .contains("Norwegian");
});
