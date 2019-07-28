const express = require("express");
const fs = require("fs");
const nock = require("nock");
const path = require("path");
const supertest = require("supertest");
const api = require(".");

const app = express();
app.use("/", api);

function resolveDataPath(fileName) {
    return path.resolve(__dirname, `__testdata__/ordbok/${fileName}`);
}

test.each(["stas", "for", "tilsynelatende"])(
    "correctly parses HTML into data structure",
    async word => {
        nock("https://ordbok.uib.no")
            .get(`/perl/ordbok.cgi?OPP=${word}`)
            .replyWithFile(200, resolveDataPath(`${word}.html`));

        const response = await supertest(app).get(`/ordbok/${word}`);

        const expectedData = JSON.parse(
            await fs.promises.readFile(resolveDataPath(`${word}.json`))
        );
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expectedData);
    }
);

test("returns Not Found (404) if 'not found' page is received", async () => {
    nock("https://ordbok.uib.no")
        .get("/perl/ordbok.cgi?OPP=notaword")
        .replyWithFile(200, resolveDataPath("not-found.html"));

    const response = await supertest(app).get("/ordbok/notaword");

    expect(response.statusCode).toBe(404);
});

test("returns Service Unavailable (503) if network error", async () => {
    nock("https://ordbok.uib.no")
        .get("/perl/ordbok.cgi?OPP=hallo")
        .replyWithError({ code: "EAI_AGAIN" });

    const response = await supertest(app).get("/ordbok/hallo");

    expect(response.statusCode).toBe(503);
});

test("returns Service Unavailable (503) if Service Unavailable received", async () => {
    nock("https://ordbok.uib.no")
        .get("/perl/ordbok.cgi?OPP=hallo")
        .reply(503);

    const response = await supertest(app).get("/ordbok/hallo");

    expect(response.statusCode).toBe(503);
});

test("returns Internal Server Error (500) if other HTTP error received", async () => {
    nock("https://ordbok.uib.no")
        .get("/perl/ordbok.cgi?OPP=hallo")
        .reply(404);

    const response = await supertest(app).get("/ordbok/hallo");

    expect(response.statusCode).toBe(500);
});

test("returns Internal Server Error (500) if HTML received does not match expected structure", async () => {
    nock("https://ordbok.uib.no")
        .get("/perl/ordbok.cgi?OPP=tilsynelatende")
        .replyWithFile(200, resolveDataPath("unexpected-structure.html"));

    const response = await supertest(app).get("/ordbok/tilsynelatende");

    expect(response.statusCode).toBe(500);
});
