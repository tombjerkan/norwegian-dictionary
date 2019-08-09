const express = require("express");
const fs = require("fs");
const nock = require("nock");
const path = require("path");
const supertest = require("supertest");
const api = require(".");

const app = express();
app.use("/", api);

function resolveDataPath(fileName) {
    return path.resolve(__dirname, `__testdata__/wiktionary/${fileName}`);
}

/*
 *  Words are added as test cases when an error is caused parsing their pages.
 *  The list below outlines what about their page was different to all previous
 *  test cases that meant that the cause of the error was not caught by an
 *  existing test case.
 *
 *      for:                initial test page
 *
 *      tilsynelatende:     only one entry
 */
test.each(["for", "tilsynelatende"])(
    "correctly parses HTML into data structure",
    async word => {
        nock("https://en.wiktionary.org")
            .get(`/wiki/${word}`)
            .replyWithFile(200, resolveDataPath(`${word}.html`));

        const response = await supertest(app).get(`/wiktionary/${word}`);

        const expectedData = JSON.parse(
            await fs.promises.readFile(resolveDataPath(`${word}.json`))
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expectedData);
    }
);

test("returns Not Found (404) if 'not found' page is received", async () => {
    nock("https://en.wiktionary.org")
        .get("/wiki/notaword")
        .replyWithFile(404, resolveDataPath("not-found.html"));

    const response = await supertest(app).get("/wiktionary/notaword");

    expect(response.statusCode).toBe(404);
});

test("returns Not Found (404) if no Norwegian Bokmaal entry on received page", async () => {
    nock("https://en.wiktionary.org")
        .get("/wiki/rain")
        .replyWithFile(200, resolveDataPath("not-norwegian.html"));

    const response = await supertest(app).get("/wiktionary/rain");

    expect(response.statusCode).toBe(404);
});

test("returns Service Unavailable (503) if network error", async () => {
    nock("https://en.wiktionary.org")
        .get("/wiki/hallo")
        .replyWithError({ code: "EAI_AGAIN" });

    const response = await supertest(app).get("/wiktionary/hallo");

    expect(response.statusCode).toBe(503);
});

test("returns Service Unavailable (503) if Service Unavailable received", async () => {
    nock("https://en.wiktionary.org")
        .get("/wiki/hallo")
        .reply(503);

    const response = await supertest(app).get("/wiktionary/hallo");

    expect(response.statusCode).toBe(503);
});

test("returns Internal Server Error (500) if other HTTP error received", async () => {
    nock("https://en.wiktionary.org")
        .get("/wiki/hallo")
        .reply(500);

    const response = await supertest(app).get("/wiktionary/hallo");

    expect(response.statusCode).toBe(500);
});
